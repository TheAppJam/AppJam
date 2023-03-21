import React, { useEffect, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TextInput,
  Button,
  FlatList,
  Image,
  Modal,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Entypo } from "@expo/vector-icons";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

function CustomTextInput({
  defaultValue,
  handleTextInputChange,
  componentName,
  placeholder,
}) {
  useEffect(() => {
    handleTextInputChange(componentName, defaultValue);
  }, [defaultValue]);
  return (
    <TextInput
      style={{ borderWidth: 1, padding: 10 }}
      defaultValue={defaultValue}
      onChangeText={(text) => handleTextInputChange(componentName, text)}
      placeholder={placeholder}
      placeholderTextColor="#858484"
    />
  );
}

function HomeScreen({ route, navigation }) {
  const defaultStore = {
    queries: {},
    components: {
      text1: { id: "b80ce42e-bf30-4f4e-9bf9-23fc83fdb03f" },
      textinput1: { value: "", id: "aa6d72af-c2e9-4fbf-9397-451a87612e5a" },
      button1: { id: "694fd167-ae54-4e53-b1cc-e08c0d482f55" },
      listview1: { id: "6da60f34-dce1-4634-aa5d-b3cb55c0638d" },
    },
    variables: {},
  };
  const [store, setStore] = useState(defaultStore);

  useEffect(() => {}, []);

  const changeStore = (comp, exposedVariable, value) => {
    setStore((store) => ({
      ...store,
      components: {
        ...store.components,
        [comp]: {
          ...store.components[comp],
          [exposedVariable]: value,
        },
      },
    }));
  };

  const changeStoreVariable = (key, value) => {
    setStore((store) => ({
      ...store,
      variables: {
        ...store.variables,
        [key]: value,
      },
    }));
  };

  const resolveCode = (code, store) => {
    if (!code.startsWith("store?.")) return code;
    let result = "";
    const evalFunction = Function(["store"], ` return ${code || ""} `);
    result = evalFunction(store);
    return result;
  };

  function getDynamicVariables(text) {
    const matchedParams = text.match(/{(.*?)}/g) || text.match(/%%(.*?)%%/g);
    return matchedParams;
  }

  const resolveParamVar = (code, route, store) => {
    let result = "";
    code = code.replace(/[{()}]/g, "");
    const evalFunction = Function(["route", "store"], ` return ${code || ""} `);
    result = evalFunction(route, store);

    return result;
  };

  const resolveUrl = (url, route, store) => {
    const containsVar = getDynamicVariables(url);
    if (!containsVar) return url;
    for (const dynamicVariable of containsVar) {
      value = resolveParamVar(dynamicVariable, route, store);
      if (typeof value !== "function") {
        url = url.replace(dynamicVariable, `${value}`);
      }
    }
    return url;
  };

  const resolveRequest = (request) => {
    const body = JSON.parse(request.body);
    Object.keys(body).map((item) => {
      body[item] = resolveCode(body[item], store);
    });
    request.body = JSON.stringify(body);
    return request;
  };

  const handleTextInputChange = (textField, value) => {
    setStore((store) => ({
      ...store,
      components: {
        ...store.components,
        [textField]: {
          ...store.components[textField],
          value: value,
        },
      },
    }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={{ paddingHorizontal: 20 }}>
        <Text
          style={{
            margin: 20,
            fontSize: 14,
            textAlign: "left",
            color: "#000000",
            fontWeight: "normal",
          }}
        >
          Text goessss !
        </Text>
        <CustomTextInput
          defaultValue={""}
          handleTextInputChange={handleTextInputChange}
          componentName="textinput1"
          placeholder="Placeholder text"
        />
        <View>
          <TouchableOpacity
            style={{
              borderRadius: 10,
              paddingVertical: 10,
              paddingHorizontal: 30,
              elevation: 2,
              backgroundColor: "#4e3cf0",
              marginVertical: 15,
              alignSelf: "center",
            }}
            onPress={() => {
              console.log();
            }}
          >
            <Text style={{ color: "#fff" }}>Button</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffff",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
