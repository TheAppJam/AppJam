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
      listview1: { id: "3af316bc-69ad-46a3-9211-ee055c1a4092" },
      container1: { id: "5371edc6-bdad-4a1a-9c39-eb25e547d0b6" },
      text1: { id: "f167e11d-dfb7-4690-9805-a85b65bc5c5d" },
      modal1: { show: false, id: "0e17d030-ec20-448f-ac57-b6b27f11df1e" },
      textinput1: {
        value: "{{variables.selectedItem.name}}",
        id: "0a648286-2da8-4dc3-b640-7feb1b25653b",
      },
      button1: { id: "fa31b895-363c-4e32-8909-926e5aa4cbfe" },
    },
    variables: {},
  };
  const [store, setStore] = useState(defaultStore);

  useEffect(() => {
    getAllUsers();
  }, []);

  const change_name = () => {
    let requestOptions = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: '{"name":"store?.components?.textinput1?.value"}',
    };
    if (requestOptions.method !== "GET") {
      requestOptions = resolveRequest(requestOptions);
    }
    setStore((store) => ({
      ...store,
      queries: {
        ...store.queries,
        ["change_name"]: {
          isLoading: true,
          data: [],
        },
      },
    }));
    fetch(
      resolveUrl(
        `https://63bba00f32d17a509093eebc.mockapi.io/api/v1/users/{store?.variables?.selectedItem?.id}`,
        route,
        store
      ),
      requestOptions
    ).then((data) => {
      data.text().then((value) => {
        const finalResult = JSON.parse(value);
        setStore((store) => ({
          ...store,
          queries: {
            ...store.queries,
            ["change_name"]: {
              ...store.queries["change_name"],
              data: finalResult,
              isLoading: false,
            },
          },
        }));
      });
    });
  };

  const getAllUsers = () => {
    let requestOptions = { method: "GET", headers: {} };
    if (requestOptions.method !== "GET") {
      requestOptions = resolveRequest(requestOptions);
    }
    setStore((store) => ({
      ...store,
      queries: {
        ...store.queries,
        ["getAllUsers"]: {
          isLoading: true,
          data: [],
        },
      },
    }));
    fetch(
      resolveUrl(
        `https://63bba00f32d17a509093eebc.mockapi.io/users`,
        route,
        store
      ),
      requestOptions
    ).then((data) => {
      data.text().then((value) => {
        const finalResult = JSON.parse(value);
        setStore((store) => ({
          ...store,
          queries: {
            ...store.queries,
            ["getAllUsers"]: {
              ...store.queries["getAllUsers"],
              data: finalResult,
              isLoading: false,
            },
          },
        }));
      });
    });
  };

  const second_api = () => {
    let requestOptions = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: '{"name":"store?.components?.textinput1?.value"}',
    };
    if (requestOptions.method !== "GET") {
      requestOptions = resolveRequest(requestOptions);
    }
    setStore((store) => ({
      ...store,
      queries: {
        ...store.queries,
        ["second_api"]: {
          isLoading: true,
          data: [],
        },
      },
    }));
    fetch(
      resolveUrl(
        `https://63bba00f32d17a509093eebc.mockapi.io/api/v1/users/1`,
        route,
        store
      ),
      requestOptions
    ).then((data) => {
      data.text().then((value) => {
        const finalResult = JSON.parse(value);
        setStore((store) => ({
          ...store,
          queries: {
            ...store.queries,
            ["second_api"]: {
              ...store.queries["second_api"],
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

  const resolveParamVar = (code, route, store, isJsCode) => {
    let result = "";
    code = code.replace(/[{()}]/g, "");
    const evalFunction = Function(["route", "store"], ` return ${code || ""} `);
    result = evalFunction(
      isJsCode ? route : undefined,
      isJsCode ? store : undefined
    );

    return result;
  };

  const resolveUrl = (url, route, store) => {
    const containsVar = getDynamicVariables(url);
    if (!containsVar) return url;
    for (const dynamicVariable of containsVar) {
      value = resolveParamVar(dynamicVariable, route, store, true);
      if (typeof value !== "function") {
        url = url.replace(dynamicVariable, `${value}`);
      }
    }
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
          data={store?.queries?.getAllUsers?.data?.value}
          renderItem={({ item }) => {
            return (
              <>
                <Pressable
                  onPress={() => {
                    changeStore("modal1", "show", true);
                    changeStoreVariable("selectedItem", item);
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
                    {item.name && (
                      <Text
                        style={{
                          margin: 20,
                          fontSize: 14,
                          textAlign: "left",
                          color: "#000000",
                          fontWeight: "normal",
                        }}
                      >
                        {item.name}
                      </Text>
                    )}
                  </View>
                </Pressable>
              </>
            );
          }}
        />
        <Modal
          animationType="slide"
          transparent={true}
          visible={store.components.modal1.show}
          onRequestClose={() => {
            changeStore("modal1", "show", false);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <CustomTextInput
                defaultValue={store?.variables?.selectedItem?.name}
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
                    change_name();
                    getAllUsers();
                    changeStore("modal1", "show", false);
                  }}
                >
                  <Text style={{ color: "#fff" }}>Button</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
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
