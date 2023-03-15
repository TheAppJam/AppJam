export const ActionTypes = [
  {
    name: 'Run Query',
    id: 'run-query',
    options: [{ queryId: '' }],
  },
  {
    name: 'Show Alert',
    id: 'show-alert',
    options: [{ name: 'message', type: 'text', default: 'Message !' }],
  },
  {
    name: 'Show Modal',
    id: 'show-modal',
    options: [{ name: 'modal', type: 'text', default: '' }],
  },
  {
    name: 'Close Modal',
    id: 'close-modal',
    options: [{ name: 'modal', type: 'text', default: '' }],
  },
  {
    name: 'Set variable',
    id: 'set-custom-variable',
    options: [
      { name: 'key', type: 'code', default: '' },
      { name: 'value', type: 'code', default: '' },
    ],
  },
  {
    name: 'Navigate Screen',
    id: 'navigate-screen',
    options: [{ name: 'page', type: 'text', default: '' }],
  },
]