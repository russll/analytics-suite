const store = {
  admin: [
    { route: '/admin/users', text: 'Пользователи' },
    { route: '/admin/logs', text: 'Логи' },
    { disabled: true },
    { disabled: true },
    { route: '/', text: 'Вернуться' }
  ]
};

export default function getMenu (name) {
  if (store[name]) return store[name];
}