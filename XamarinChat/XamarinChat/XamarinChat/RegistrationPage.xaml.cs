using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SimpleChatApp.CommonTypes;
using SimpleChatApp.GrpcService;
using Xamarin.Forms;
using Xamarin.Forms.Xaml;
using static SimpleChatApp.GrpcService.ChatService;

namespace XamarinChat
{
    [XamlCompilation(XamlCompilationOptions.Compile)]
    public partial class RegistrationPage : ContentPage
    {
        private static string errorRegistrationTitle = "Account registration error";
        private static string okTitle = "Ok";
        private static string loginAlreadyExistError = "Sorry, Login already exist";
        private static string unknownError = "Sorry, we have no idea why:(";
        private static string emptyCredentialsError = "Login or Password should be not empty";
        private static string differentPasswordsError = "Passwords are different. Please try again.";
        private ChatServiceClient chatServiceClient;

        public RegistrationPage()
        {
            InitializeComponent();
            chatServiceClient = new ChatServiceClient(new Grpc.Core.Channel("localhost", 30051, Grpc.Core.ChannelCredentials.Insecure));

        }

        private void MainPage_Pressed(object sender, EventArgs e)
        {
            Navigation.PopModalAsync();
        }


        private async void CreateAccount_Pressed(object sender, EventArgs e)
        {
            if (Login.Text != null && Login.Text != "" && Password.Text != null && Password.Text != "" && PasswordChecker.Text != "" && PasswordChecker.Text != null)
            {
                if (Password.Text == PasswordChecker.Text)
                {
                    var userData = new UserData()
                    {
                        Login = Login.Text,
                        PasswordHash = SHA256.GetStringHash(Password.Text)
                    };
                    var result = await chatServiceClient.RegisterNewUserAsync(userData);
                    if (result.Status == SimpleChatApp.GrpcService.RegistrationStatus.RegistrationSuccessfull)
                    {
                        await Navigation.PopModalAsync();
                    }
                    else
                    {
                        var error = result.Status == SimpleChatApp.GrpcService.RegistrationStatus.LoginAlreadyExist ? loginAlreadyExistError : unknownError;
                        await DisplayAlert(errorRegistrationTitle, error, okTitle);
                    }
                }
                else { await DisplayAlert(errorRegistrationTitle, differentPasswordsError, okTitle); }
            }
            else { await DisplayAlert(errorRegistrationTitle, emptyCredentialsError, okTitle); }
        }
    }
}