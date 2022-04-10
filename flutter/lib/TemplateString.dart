class TemplateString {
  final List<String> fixedComponents;
  final Map<int, String> genericComponents;

  int totalComponents;

  TemplateString(String template)
      : fixedComponents = <String>[],
        genericComponents = <int, String>{},
        totalComponents = 0 {
    final List<String> components = template.split('{');

    for (String component in components) {
      if (component == '') continue;

      final split = component.split('}');

      if (split.length != 1) {
        genericComponents[totalComponents] = split.first;
        totalComponents++;
      }

      if (split.last != '') {
        fixedComponents.add(split.last);
        totalComponents++;
      }
    }
  }

  String format(Map<String, dynamic> params) {
    String result = '';

    int fixedComponent = 0;
    for (int i = 0; i < totalComponents; i++) {
      if (genericComponents.containsKey(i)) {
        result += '${params[genericComponents[i]]}';
        continue;
      }
      result += fixedComponents[fixedComponent++];
    }

    return result;
  }
}
