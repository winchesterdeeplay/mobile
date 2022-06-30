using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Diagnostics;
using System.Dynamic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Google.Protobuf.WellKnownTypes;
using Grpc.Core;
using SimpleChatApp.CommonTypes;
using SimpleChatApp.GrpcService;
using Xamarin.Forms;
using Xamarin.Forms.Xaml;
using static SimpleChatApp.GrpcService.ChatService;
using Guid = SimpleChatApp.GrpcService.Guid;

namespace XamarinChat
{
    public partial class MainPage : ContentPage
    {
        public bool isAuth = false;
        private ChatServiceClient chatServiceClient;
        private ObservableCollection<EnrichedMessageData> chat = new ObservableCollection<EnrichedMessageData>();
        private Dictionary<String, Color> usersColors = new Dictionary<String, Color>();
        private HashSet<Color> usedColors = new HashSet<Color>();
        private Random rnd = new Random();
        private Guid guid;

        private static string authErrorTitle = "Auth error";
        private static string chatErrorTitle = "Chat error";
        private static string chatEmptyMessageError = "Please enter the message first";
        private static string emptyCredentialsError = "Login or Password should be not empty";
        private static string wrongCredentialsError = "Incorrect Login or Passowrd";
        private static string unknownError = "Sorry, we have no idea why:(";
        private static string okTitle = "Ok";


        public MainPage()
        {
            ;
            InitializeComponent();
            Title = "XamarinChat";
            chatServiceClient = new ChatServiceClient(new Grpc.Core.Channel("localhost", 30051, Grpc.Core.ChannelCredentials.Insecure));
            MessagesList.ItemsSource = chat;
            guid = new Guid();
            ChatBlock.IsVisible = false;
        }

        private void Blocks_Changer(bool isAuth)
        {
            if (isAuth)
            {

                ChatBlock.IsVisible = true;
                AuthBlock.IsVisible = false;
            }
            else
            {
                ChatBlock.IsVisible = false;
                AuthBlock.IsVisible = true;
            }
        }
        private void RegistrationPage_Pressed(object sender, EventArgs e)
        {
            var registrationPage = new RegistrationPage();
            Navigation.PushModalAsync(registrationPage);
        }

        private async void LogOut_Pressed(object sender, EventArgs e)
        {
            await Unsubscribe(AddMessage);
            guid = new Guid();
            isAuth = false;

            Blocks_Changer(isAuth);

        }

        private Color GetColor()
        {
            Color randomColor = Color.FromRgb(rnd.Next(256), rnd.Next(256), 0);
            if (usedColors.Contains(randomColor)) { return GetColor(); } else { return randomColor; }
        }

        private void ScrollMessagesList(object Obj)
        {
            MessagesList.ScrollTo(Obj, ScrollToPosition.End, true);
        }

        private async void Auth_Pressed(object sender, EventArgs e)
        {
            if (Login.Text != null && Password.Text != null && Password.Text != "" && Login.Text != "")
            {
                var userData = new UserData()
                {
                    Login = Login.Text,
                    PasswordHash = SHA256.GetStringHash(Password.Text)
                };
                var authData = new AuthorizationData()
                {
                    ClearActiveConnection = true,
                    UserData = userData
                };
                var result = await chatServiceClient.LogInAsync(authData);
                if (result.Status == SimpleChatApp.GrpcService.AuthorizationStatus.AuthorizationSuccessfull)
                {
                    guid = result.Sid;
                    isAuth = true;
                    var messages = await GetMessages();
                    foreach (var message in messages)
                    {
                        AddMessage(message);
                    }
                    Blocks_Changer(isAuth);
                    await Subscribe(AddMessage);
                }
                else
                {
                    var error = result.Status == SimpleChatApp.GrpcService.AuthorizationStatus.WrongLoginOrPassword ? wrongCredentialsError : unknownError;
                    await DisplayAlert(authErrorTitle, error, okTitle);
                }
            }
            else { await DisplayAlert(authErrorTitle, emptyCredentialsError, okTitle); }
        }

        private async Task<List<SimpleChatApp.GrpcService.MessageData>> GetMessages()
        {
            var now = DateTime.MaxValue;
            var then = DateTime.MinValue;

            var timeIntervalRequest = new TimeIntervalRequest()
            {
                StartTime = Timestamp.FromDateTime(then.ToUniversalTime()),
                EndTime = Timestamp.FromDateTime(now.ToUniversalTime()),
                Sid = guid
            };
            var messages = await chatServiceClient.GetLogsAsync(timeIntervalRequest);
            return messages.Logs.ToList();
        }

        private async Task Subscribe(Action<SimpleChatApp.GrpcService.MessageData> onMessage)
        {
            var streamingCall = chatServiceClient.Subscribe(guid);
            while (await streamingCall.ResponseStream.MoveNext())
            {
                var messages = streamingCall.ResponseStream.Current;
                foreach (var message in messages.Logs)
                {
                    onMessage(message);
                }
            }
        }
        private async Task Unsubscribe(Action<SimpleChatApp.GrpcService.MessageData> onMessage)
        {
            await chatServiceClient.UnsubscribeAsync(guid);
        }

        private async Task SendMessage(string message)
        {
            var outgoingMessage = new OutgoingMessage()
            {
                Sid = guid,
                Text = message
            };
            var ans = await chatServiceClient.WriteAsync(outgoingMessage);
        }

        private async void Send_Pressed(object sender, EventArgs e)
        {
            if (MessageEntry.Text != null && MessageEntry.Text != "")
            {
                await SendMessage(MessageEntry.Text);
            }
            else
            {
                await DisplayAlert(chatErrorTitle, chatEmptyMessageError, okTitle);
            }
        }

        public class EnrichedMessageData
        {
            public String UserLogin { get; set; }
            public String Text { get; set; }
            public Color Color { get; set; }
        }
        private void AddMessage(SimpleChatApp.GrpcService.MessageData md)
        {

            EnrichedMessageData tempEnrichedMessageData = new EnrichedMessageData();
            var randomColor = GetColor();
            usedColors.Add(randomColor);
            if (!(usersColors.Keys.Contains(md.PlayerLogin)))
            { usersColors.Add(md.PlayerLogin, randomColor); }

            tempEnrichedMessageData.UserLogin = md.PlayerLogin;
            tempEnrichedMessageData.Text = md.Text;
            tempEnrichedMessageData.Color = usersColors[md.PlayerLogin];

            chat.Add(tempEnrichedMessageData);
            ScrollMessagesList(tempEnrichedMessageData);
        }


    }
}
