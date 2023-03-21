export const widgets = [
  {
    name: "Text",
    displayName: "Text",
    description: "Display markdown or HTML",
    component: "Text",
    properties: {
      text: {
        type: "text",
        displayName: "Text",
      },
    },
    definition: {
      properties: {
        text: { value: "Text goessss !" },
      },
      styles: {
        textSize: { value: 14 },
        width: { value: 50 },
        height: { value: 20 },
        fontWeight: { value: 'normal'},
        textColor: { value: '#000000' },
        textAlign: { value: 'left' },
      },
      events: [],
    },
    events: {},
    styles: {
      width: {
        type: 'number',
        displayName: "Width",
      },
      height: {
        type: 'number',
        displayName: "Width",
      },
      textSize: {
        type: 'number',
        displayName: "Text Size"
      },
      fontWeight: {
        type: 'select',
        displayName: 'Font Weight',
        options: [
          { name: 'normal', value: 'normal' },
          { name: 'bold', value: 'bold' }
        ],
      },
      textColor: {
        type: 'text',
        displayName: 'Text Color',
        validation: {
          schema: { type: 'string' },
        },
      },
      textAlign: {
        type: 'select',
        displayName: 'Text Align',
        options: [
          { name: 'left', value: 'left' },
          { name: 'center', value: 'center' },
          { name: 'right', value: 'right' }
        ],
      },
    }
  },
  {
    name: "TextInput",
    displayName: "Text Input",
    description: "Text field",
    component: "TextInput",
    properties: {
      value: {
        type: "code",
        displayName: "Default value",
        validation: {
          schema: {
            type: "string",
          },
        },
      },
      placeholder: {
        type: "code",
        displayName: "Placeholder",
        validation: {
          schema: { type: "string" },
        },
      },
    },
    events: {},
    exposedVariables: {
      value: "",
    },
    definition: {
      properties: {
        value: { value: "" },
        placeholder: { value: "Placeholder text" },
      },
      styles: {
        width: { value: 60 },
        height: { value: 20 }
      },
      events: [],
    },
    styles: {
      width: {
        type: "text",
        displayName: "Width",
      },
      height: {
        type: "text",
        displayName: "Width",
      }
    }
  },
  {
    name: "Button",
    displayName: "Button",
    description: "Trigger actions: queries, alerts etc",
    component: "Button",
    properties: {
      text: {
        type: "code",
        displayName: "Button Text",
        validation: {
          schema: { type: "string" },
        },
      },
    },
    events: {
      onClick: { displayName: "On click" },
    },
    exposedVariables: {},
    definition: {
      properties: {
        text: { value: `Button` },
      },
      styles: {
        width: { value: 80 },
        height: { value: 20 },
        buttonAlign: { value: 'flex-start'}
      },
      events: [],
    },
    styles: {
      width: {
        type: "text",
        displayName: "Width",
      },
      height: {
        type: "text",
        displayName: "Height",
      },
      buttonAlign: {
        type: 'select',
        displayName: 'Button Align',
        options: [
          { name: 'start', value: 'flex-start' },
          { name: 'center', value: 'center' },
          { name: 'end', value: 'flex-end' }
        ],
      },
    }
  },
  {
    name: "Listview",
    displayName: "List View",
    description: "Wrapper for multiple components",
    component: "Listview",
    properties: {
      data: {
        type: "code",
        displayName: "List data",
        validation: {
          schema: { type: "array", element: { type: "object" } },
        },
      },
    },
    definition: {
      properties: {
        data: {
          value: "",
        },
      },
      styles: {
        width: { value: 345 },
        height: { value: 200 }
      }
    },
    styles: {
      width: {
        type: "text",
        displayName: "Width",
      },
      height: {
        type: "text",
        displayName: "Width",
      }
    }
  },
  {
    name: "Container",
    displayName: "Container",
    description: "Wrapper for multiple components",
    component: "Container",
    definition: {
      properties: {},
      styles: {
        width: { value: 300 },
        height: { value: 150 }
      },
      events: []
    },
    exposedVariables: {},
    properties: {},
    events: {
      onClick: { displayName: "On click" },
    },
    styles: {
      width: {
        type: "text",
        displayName: "Width",
      },
      height: {
        type: "text",
        displayName: "Width",
      }
    }
  },
  {
    name: "Image",
    displayName: "Image",
    description: "Display an Image",
    component: "Image",
    properties: {
      source: {
        type: 'code',
        displayName: 'URL',
        validation: {
          schema: { type: 'string' },
        },
      },
    },
    exposedVariables: {},
    definition: {
      properties: {
        source: { value: 'https://reactnative.dev/img/tiny_logo.png' }
      },
      styles: {
        width: { value: 80 },
        height: { value: 80 },
        borderRadius: { value: 4 }
      }
    },
    styles: {
      width: {
        type: "number",
        displayName: "Width",
      },
      height: {
        type: "number",
        displayName: "Height",
      },
      borderRadius: {
        type: "number",
        displayName: "Border Radius",
      }
    }
  },
  {
    name: "Divider",
    displayName: "Divider",
    description: "Separator between components",
    component: "Divider",
    properties: {},
    events: {},
    exposedVariables: {
      value: {},
    },
    definition: {
      properties: {},
      styles: {
        width: { value: 300 },
        height: { value: 10 }
      }
    },
    styles: {
      width: {
        type: "text",
        displayName: "Width",
      },
      height: {
        type: "text",
        displayName: "Width",
      }
    }
  },
  {
    name: 'Icon',
    displayName: 'Icon',
    description: 'Icon',
    component: 'Icon',
    styles: {},
    properties: {
      icon: {
        type: 'iconPicker',
        displayName: 'Icon',
        validation: {
          schema: { type: 'string' },
        },
      },
    },
    events: {
      onClick: { displayName: "On click" },
    },
    exposedVariables: {},
    definition: {
      properties: {
        icon: { value: 'air' },
      },
      events: []
    }
  },
  {
    name: 'Row',
    displayName: 'Row',
    description: 'Row',
    component: 'Row',
    styles: {},
    properties: {},
    exposedVariables: {},
    definition: {
      properties: {}
    }
  },
  {
    name: 'Column',
    displayName: 'Column',
    description: 'Column',
    component: 'Column',
    styles: {},
    properties: {},
    exposedVariables: {},
    definition: {
      properties: {}
    }
  },
  {
    name: 'Modal',
    displayName: 'Modal',
    description: 'Modal',
    component: 'Modal',
    styles: {},
    properties: {},
    exposedVariables: {
      show: false,
    },
    definition: {
      properties: {}
    }
  }
];
