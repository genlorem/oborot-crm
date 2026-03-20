export const STEPS = [
  {
    id: 'profile',
    title: 'Расскажите о себе',
    subtitle: 'Пара вопросов чтобы лучше понять ваш бизнес',
    questions: [
      {
        id: 'skuCount',
        type: 'single',
        question: 'Сколько SKU в вашем ассортименте?',
        options: [
          { value: 'lt100', label: 'До 100', emoji: '🌱' },
          { value: '100-500', label: '100–500', emoji: '🌿' },
          { value: '500-2000', label: '500–2000', emoji: '🌳' },
          { value: 'gt2000', label: 'Больше 2000', emoji: '🏭' },
        ],
      },
      {
        id: 'platforms',
        type: 'multi',
        question: 'На каких маркетплейсах работаете?',
        options: [
          { value: 'wb', label: 'Wildberries', emoji: '🟣' },
          { value: 'ozon', label: 'Ozon', emoji: '🔵' },
          { value: 'ym', label: 'Яндекс.Маркет', emoji: '🟡' },
          { value: 'ali', label: 'AliExpress', emoji: '🔴' },
        ],
      },
    ],
  },
  {
    id: 'pains',
    title: 'Что бесит в МойСклад?',
    subtitle: 'Выберите до 3 главных проблем',
    questions: [
      {
        id: 'pains',
        type: 'multi',
        maxSelect: 3,
        question: null,
        options: [
          { value: 'ui', label: 'Слишком сложный интерфейс', emoji: '😵' },
          { value: 'slow', label: 'Медленно работает / тормозит', emoji: '🐢' },
          { value: 'analytics', label: 'Нет нормальной аналитики', emoji: '📊' },
          { value: 'integrations', label: 'Плохая интеграция с маркетплейсами', emoji: '🔌' },
          { value: 'mobile', label: 'Нет нормального мобильного приложения', emoji: '📱' },
          { value: 'price', label: 'Дорого за то что есть', emoji: '💸' },
          { value: 'support', label: 'Поддержка не помогает', emoji: '🤦' },
          { value: 'training', label: 'Трудно обучить сотрудников', emoji: '🤯' },
        ],
      },
    ],
  },
  {
    id: 'severity',
    title: 'Насколько это критично?',
    subtitle: 'Как сильно эти проблемы влияют на ваш бизнес прямо сейчас?',
    questions: [
      {
        id: 'painScore',
        type: 'rating',
        question: null,
        min: 1,
        max: 10,
        minLabel: 'Терпимо',
        maxLabel: 'Боль каждый день',
      },
    ],
  },
  {
    id: 'wishes',
    title: 'Что хотите в идеальной системе?',
    subtitle: 'Выберите всё важное для вас',
    questions: [
      {
        id: 'wishes',
        type: 'multi',
        question: null,
        options: [
          { value: 'simple_ui', label: 'Простой интерфейс — разберётся за 5 минут', emoji: '✨' },
          { value: 'realtime', label: 'Реальный реалтайм по остаткам на всех складах', emoji: '⚡' },
          { value: 'forecast', label: 'Умное прогнозирование — что и когда заказывать', emoji: '🔮' },
          { value: 'unit_eco', label: 'Авторасчёт юнит-экономики и прибыли по SKU', emoji: '📈' },
          { value: 'mobile_app', label: 'Нормальное мобильное приложение', emoji: '📱' },
          { value: 'support247', label: 'Поддержка которая реально помогает 24/7', emoji: '💬' },
        ],
      },
    ],
  },
  {
    id: 'contact',
    title: 'Последний шаг 🙌',
    subtitle: 'Оставьте контакт если хотите — мы расскажем когда запустимся и можем пообщаться подробнее',
    questions: [
      {
        id: 'name',
        type: 'text',
        question: 'Как вас зовут?',
        placeholder: 'Имя (необязательно)',
        required: false,
      },
      {
        id: 'contact',
        type: 'text',
        question: 'Telegram или email',
        placeholder: '@username или email (необязательно)',
        required: false,
      },
      {
        id: 'callReady',
        type: 'checkbox',
        question: 'Готов(а) пообщаться 15 минут — хочу рассказать подробнее 🎙️',
      },
    ],
  },
]
