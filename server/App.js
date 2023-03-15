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
  }, []);
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
      listview1: { id: "64d4c492-e162-43c2-abdb-245339525676" },
      container1: { id: "40271892-3dc8-4c10-8d6b-19771d0b3ff7" },
      text1: { id: "da713c53-ddd8-4124-90d4-2f24b259e0f0" },
    },
    variables: {},
  };
  const [store, setStore] = useState(defaultStore);

  useEffect(() => {
    airtable();
  }, []);

  const airtable2 = () => {
    let requestOptions = {
      method: "GET",
      headers: {
        Authorization:
          "Bearer pat4YAtajn9F3yPPE.170024a050b69a38096ed9710577c07ef57d456ccf24290a4921ac7c24c5eb5b",
      },
    };
    if (requestOptions.method !== "GET") {
      requestOptions = resolveRequest(requestOptions);
    }
    setStore((store) => ({
      ...store,
      queries: {
        ...store.queries,
        ["airtable2"]: {
          isLoading: true,
          data: [],
        },
      },
    }));
    fetch(
      resolveUrl(
        `https://api.airtable.com/v0/appNWiL392zUHROpb/Opportunities/recBGlINojXAMUbKn`,
        route
      ),
      requestOptions
    ).then((data) => {
      data.text().then((value) => {
        const finalResult = JSON.parse(value);
        setStore((store) => ({
          ...store,
          queries: {
            ...store.queries,
            ["airtable2"]: {
              ...store.queries["airtable2"],
              data: finalResult,
              isLoading: false,
            },
          },
        }));
      });
    });
  };

  const airtable1 = () => {
    let requestOptions = {
      method: "GET",
      headers: {
        Authorization:
          "Bearer pat4YAtajn9F3yPPE.170024a050b69a38096ed9710577c07ef57d456ccf24290a4921ac7c24c5eb5b",
      },
    };
    if (requestOptions.method !== "GET") {
      requestOptions = resolveRequest(requestOptions);
    }
    setStore((store) => ({
      ...store,
      queries: {
        ...store.queries,
        ["airtable1"]: {
          isLoading: true,
          data: [],
        },
      },
    }));
    fetch(
      resolveUrl(
        `https://api.airtable.com/v0/appNWiL392zUHROpb/Opportunities/{route?.params?.id}`,
        route
      ),
      requestOptions
    ).then((data) => {
      data.text().then((value) => {
        const finalResult = JSON.parse(value);
        setStore((store) => ({
          ...store,
          queries: {
            ...store.queries,
            ["airtable1"]: {
              ...store.queries["airtable1"],
              data: finalResult,
              isLoading: false,
            },
          },
        }));
      });
    });
  };

  const airtable = () => {
    let requestOptions = {
      method: "GET",
      headers: {
        Authorization:
          "Bearer pat4YAtajn9F3yPPE.170024a050b69a38096ed9710577c07ef57d456ccf24290a4921ac7c24c5eb5b",
      },
    };
    if (requestOptions.method !== "GET") {
      requestOptions = resolveRequest(requestOptions);
    }
    setStore((store) => ({
      ...store,
      queries: {
        ...store.queries,
        ["airtable"]: {
          isLoading: true,
          data: [],
        },
      },
    }));
    fetch(
      resolveUrl(
        `https://api.airtable.com/v0/appNWiL392zUHROpb/Opportunities`,
        route
      ),
      requestOptions
    ).then((data) => {
      data.text().then((value) => {
        const finalResult = JSON.parse(value);
        setStore((store) => ({
          ...store,
          queries: {
            ...store.queries,
            ["airtable"]: {
              ...store.queries["airtable"],
              data: finalResult,
              isLoading: false,
            },
          },
        }));
      });
    });
  };

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

  const resolveCode = (code, store, isJsCode) => {
    if (!code.startsWith("store?.")) return code;
    let result = "";
    const evalFunction = Function(["store"], ` return ${code || ""} `);
    result = evalFunction(isJsCode ? store : undefined);
    return result;
  };

  function getDynamicVariables(text) {
    const matchedParams = text.match(/{(.*?)}/g) || text.match(/%%(.*?)%%/g);
    return matchedParams;
  }

  const resolveParamVar = (code, route, isJsCode) => {
    console.log(route);
    console.log(code);
    let result = "";
    code = code.replace(/[{()}]/g, "");
    const evalFunction = Function(["route"], ` return ${code || ""} `);
    console.log(evalFunction);
    result = evalFunction(isJsCode ? route : undefined);

    return result;
  };

  const resolveUrl = (url, route) => {
    const containsVar = getDynamicVariables(url);
    console.log(url);
    if (!containsVar) return url;
    for (const dynamicVariable of containsVar) {
      value = resolveParamVar(dynamicVariable, route, true);
      console.log(value, "value");
      if (typeof value !== "function") {
        url = url.replace(dynamicVariable, `${value}`);
      }
    }
    console.log(url);
    return url;
  };

  const resolveRequest = (request) => {
    const body = JSON.parse(request.body);
    Object.keys(body).map((item) => {
      body[item] = resolveCode(body[item], store, true);
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
        <FlatList
          data={store?.queries?.airtable?.data?.records}
          renderItem={({ item }) => {
            return (
              <>
                <Pressable
                  onPress={() => {
                    navigation.navigate("Users", {
                      id: item.id,
                    });
                  }}
                >
                  <View
                    style={{
                      backgroundColor: "#fff",
                      height: 112,
                      borderRadius: 20,
                      padding: 10,
                      shadowColor: "#000",
                      shadowOffset: {
                        width: 0,
                        height: 2,
                      },
                      shadowOpacity: 0.2,
                      shadowRadius: 4,
                      elevation: 2,
                    }}
                  >
                    {item.fields["Opportunity name"] && (
                      <Text
                        style={{
                          margin: 20,
                          fontSize: 14,
                          textAlign: "left",
                          color: "#000000",
                          fontWeight: "normal",
                        }}
                      >
                        {item.fields["Opportunity name"]}
                      </Text>
                    )}
                  </View>
                </Pressable>
              </>
            );
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

function UsersScreen({ route, navigation }) {
  const defaultStore = {
    queries: {},
    components: {
      text1: { id: "76cb237b-0de5-4081-9b9a-16098bf9d020" },
      button1: { id: "21549d1a-c533-4671-92ac-bf20ed8c4dda" },
    },
    variables: {},
  };
  const [store, setStore] = useState(defaultStore);

  useEffect(() => {
    airtable();
  }, []);

  const airtable2 = () => {
    let requestOptions = {
      method: "GET",
      headers: {
        Authorization:
          "Bearer pat4YAtajn9F3yPPE.170024a050b69a38096ed9710577c07ef57d456ccf24290a4921ac7c24c5eb5b",
      },
    };
    if (requestOptions.method !== "GET") {
      requestOptions = resolveRequest(requestOptions);
    }
    setStore((store) => ({
      ...store,
      queries: {
        ...store.queries,
        ["airtable2"]: {
          isLoading: true,
          data: [],
        },
      },
    }));
    fetch(
      resolveUrl(
        `https://api.airtable.com/v0/appNWiL392zUHROpb/Opportunities/recBGlINojXAMUbKn`,
        route
      ),
      requestOptions
    ).then((data) => {
      data.text().then((value) => {
        const finalResult = JSON.parse(value);
        setStore((store) => ({
          ...store,
          queries: {
            ...store.queries,
            ["airtable2"]: {
              ...store.queries["airtable2"],
              data: finalResult,
              isLoading: false,
            },
          },
        }));
      });
    });
  };

  const airtable1 = () => {
    let requestOptions = {
      method: "GET",
      headers: {
        Authorization:
          "Bearer pat4YAtajn9F3yPPE.170024a050b69a38096ed9710577c07ef57d456ccf24290a4921ac7c24c5eb5b",
      },
    };
    if (requestOptions.method !== "GET") {
      requestOptions = resolveRequest(requestOptions);
    }
    setStore((store) => ({
      ...store,
      queries: {
        ...store.queries,
        ["airtable1"]: {
          isLoading: true,
          data: [],
        },
      },
    }));
    fetch(
      resolveUrl(
        `https://api.airtable.com/v0/appNWiL392zUHROpb/Opportunities/{route?.params?.id}`,
        route
      ),
      requestOptions
    ).then((data) => {
      data.text().then((value) => {
        const finalResult = JSON.parse(value);
        setStore((store) => ({
          ...store,
          queries: {
            ...store.queries,
            ["airtable1"]: {
              ...store.queries["airtable1"],
              data: finalResult,
              isLoading: false,
            },
          },
        }));
      });
    });
  };

  const airtable = () => {
    let requestOptions = {
      method: "GET",
      headers: {
        Authorization:
          "Bearer pat4YAtajn9F3yPPE.170024a050b69a38096ed9710577c07ef57d456ccf24290a4921ac7c24c5eb5b",
      },
    };
    if (requestOptions.method !== "GET") {
      requestOptions = resolveRequest(requestOptions);
    }
    setStore((store) => ({
      ...store,
      queries: {
        ...store.queries,
        ["airtable"]: {
          isLoading: true,
          data: [],
        },
      },
    }));
    fetch(
      resolveUrl(
        `https://api.airtable.com/v0/appNWiL392zUHROpb/Opportunities`,
        route
      ),
      requestOptions
    ).then((data) => {
      data.text().then((value) => {
        const finalResult = JSON.parse(value);
        setStore((store) => ({
          ...store,
          queries: {
            ...store.queries,
            ["airtable"]: {
              ...store.queries["airtable"],
              data: finalResult,
              isLoading: false,
            },
          },
        }));
      });
    });
  };

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

  const resolveCode = (code, store, isJsCode) => {
    if (!code.startsWith("store?.")) return code;
    let result = "";
    const evalFunction = Function(["store"], ` return ${code || ""} `);
    result = evalFunction(isJsCode ? store : undefined);
    return result;
  };

  function getDynamicVariables(text) {
    const matchedParams = text.match(/{(.*?)}/g) || text.match(/%%(.*?)%%/g);
    return matchedParams;
  }

  const resolveParamVar = (code, route, isJsCode) => {
    console.log(route);
    console.log(code);
    let result = "";
    code = code.replace(/[{()}]/g, "");
    const evalFunction = Function(["route"], ` return ${code || ""} `);
    console.log(evalFunction);
    result = evalFunction(isJsCode ? route : undefined);

    return result;
  };

  const resolveUrl = (url, route) => {
    const containsVar = getDynamicVariables(url);
    console.log(url);
    if (!containsVar) return url;
    for (const dynamicVariable of containsVar) {
      value = resolveParamVar(dynamicVariable, route, true);
      console.log(value, "value");
      if (typeof value !== "function") {
        url = url.replace(dynamicVariable, `${value}`);
      }
    }
    console.log(url);
    return url;
  };

  const resolveRequest = (request) => {
    const body = JSON.parse(request.body);
    Object.keys(body).map((item) => {
      body[item] = resolveCode(body[item], store, true);
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
        {store?.queries?.airtable1?.data?.fields?.Status && (
          <Text
            style={{
              margin: 20,
              fontSize: 14,
              textAlign: "left",
              color: "#000000",
              fontWeight: "normal",
            }}
          >
            Text goessss {store?.queries?.airtable1?.data?.fields?.Status}
          </Text>
        )}
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
              airtable1();
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
        <Stack.Screen name="Users" component={UsersScreen} />
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
