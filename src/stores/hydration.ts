import { defineStore } from 'pinia'
import { ref, reactive, computed } from 'vue'

interface Reminder {
  time: string
  enabled: boolean
}

interface NotificationMessage {
  message: string
  color: string
  timeout: number
}

const getTodayDate = () => new Date().toISOString().split('T')[0]

export const useHydrationStore = defineStore('hydration', () => {
  const dailyGoal = ref(8)
  const hydrationProgress = ref(0)
  const streak = ref(0)
  const dailyStats = reactive<Record<string, number>>({})
  const lastLoggedDay = ref('')
  const selectedDay = ref('')
  const smartModeEnabled = ref(false)
  const notification = ref<NotificationMessage | null>(null)
  const reminders = ref<Reminder[]>([])
  const _reminderInterval = ref<number | null>(null)
  const _smartReminderInterval = ref<number | null>(null)
  const _lastNotificationTime = ref<number>(0)
  const formattedDailyStats = computed(() =>
    Object.keys(dailyStats)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
      .map(date => ({
        date,
        amount: dailyStats[date]
      }))
  )

  type DrinkType = keyof typeof drinks
  const drinks = {
    "Water": 1.0,
    "Juice": 0.95,
    "Coconut Water": 0.9,
    "Smoothie": 0.7,
    "Soda": 0.8,
    "Milkshake": 0.8,
    "Milk": 1.3,
    "Skim/Almond/Oat/Soy Milk": 0.9,
    "Yogurt": 0.7,
    "Tea": 0.9,
    "Decaf Coffee": 0.9,
    "Coffee": 0.6,
    "Hot Chocolate": 0.8,
    "Beer": -0.4,
    "Wine": -0.95,
    "Shot": -1.59,
    "Whiskey/Brandy/Tequila/Gin/Rum": -3.18
  }

  // 🧠 getters
  const progressPercentage = computed(() =>
    Math.min((hydrationProgress.value / dailyGoal.value) * 100, 100)
  )

  const goalMet = computed(() =>
    hydrationProgress.value >= dailyGoal.value
  )

  const isTodaySelected = computed(() =>
    selectedDay.value === getTodayDate()
  )

  const selectedDayProgress = computed(() =>
    dailyStats[selectedDay.value] || 0
  )

  const selectedDayGoalMet = computed(() =>
    selectedDayProgress.value >= dailyGoal.value
  )

  const selectedDayProgressPercentage = computed(() =>
    Math.min((selectedDayProgress.value / dailyGoal.value) * 100, 100)
  )

  const recentDays = computed(() => {
    const days = []
    const today = new Date()
    for (let i = 0; i < 7; i++) {
      const d = new Date(today)
      d.setDate(today.getDate() - i)
      const dateString = d.toISOString().split('T')[0]
      days.push({
        date: dateString,
        displayDate: i === 0 ? 'Today' : dateString,
        amount: dailyStats[dateString]
      })
    }
    return days
  })

  // 🔁 actions
  function logDrink(drinkType: DrinkType, amount: number) {
    if (isNaN(amount) || amount <= 0) {
      showNotification('Please enter a valid amount!', 'red', 3)
      return
    }
    resetDailyProgress()
    hydrationProgress.value += amount * (drinks[drinkType] ?? 1)
    dailyStats[getTodayDate()] = hydrationProgress.value
    showNotification(`Logged ${amount} cups of ${drinkType}!`, '#25be4d', 2)
  }

  async function requestNotificationPermission() {
    if (!('Notification' in window)) {
      showNotification('This browser does not support notifications.', 'red', 3)
      return
    }
    const permission = await Notification.requestPermission()
    if (permission === 'granted') {
      showNotification('Notification permission granted!', '#25be4d', 3)
    } else {
      showNotification('Notification permission denied.', 'red', 3)
    }
  }

  function showNotification(
    message: string,
    color: string = 'cyan',
    timeout: number = 2
  ): void {
    notification.value = { message, color, timeout }

    setTimeout((): void => {
      notification.value = null
    }, timeout * 1000)
  }

  function toggleSmartMode(): void {
    smartModeEnabled.value = !smartModeEnabled.value
    scheduleReminders()
    showNotification(`Smart Mode ${smartModeEnabled.value ? 'Enabled' : 'Disabled'}!`, 'cyan', 3)
  }

  function setSelectedDay(date: string) {
    selectedDay.value = date
  }

  function initializeStore() {
    resetDailyProgress()
    checkStreak()
    scheduleReminders()
  }

  function resetDailyProgress() {
    const today = getTodayDate()
    if (today !== lastLoggedDay.value) {
      checkStreak()
      hydrationProgress.value = 0
      lastLoggedDay.value = today
    }
  }

  function checkStreak() {
    const today = getTodayDate()
    const prev = lastLoggedDay.value
    if (prev && prev !== today) {
      const progress = dailyStats[prev] || 0
      streak.value = progress >= dailyGoal.value ? streak.value + 1 : 0
    } else if (!prev) {
      streak.value = 0
    }
  }

  function scheduleReminders() {
    if (_reminderInterval.value) clearInterval(_reminderInterval.value)
    if (_smartReminderInterval.value) clearInterval(_smartReminderInterval.value)

    const sendNotification = (title: string, body: string) => {
      if (Notification.permission === 'granted') {
        const now = new Date()
        if (!(_lastNotificationTime.value) || now.getTime() - _lastNotificationTime.value > 59000) {
          new Notification(title, {
            body,
            icon: '/Hydration-logo.jpg',
          })
          _lastNotificationTime.value = now.getTime()
        }
      }
    }

    _reminderInterval.value = setInterval(() => {
      const now = new Date()
      const currentTime = now.toTimeString().slice(0, 5)
      reminders.value.forEach(reminder => {
        if (reminder.enabled && reminder.time === currentTime) {
          sendNotification('Hydration Reminder', 'Time to drink some water!')
        }
      })
    }, 60000)

    if (smartModeEnabled.value) {
      const smartTimes = ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00']
      _smartReminderInterval.value = setInterval(() => {
        const now = new Date()
        const currentTime = now.toTimeString().slice(0, 5)
        if (smartTimes.includes(currentTime)) {
          sendNotification('Smart Hydration Reminder', 'It\'s a good time for a drink!')
        }
      }, 60000)
    }
  }

  function addReminder(time: string) {
    if (reminders.value.some(r => r.time === time)) {
      showNotification('Reminder at this time already exists!', 'orange', 3)
      return
    }
    reminders.value.push({ time, enabled: true })
    reminders.value.sort((a, b) => a.time.localeCompare(b.time))
    scheduleReminders()
    showNotification(`Reminder set for ${time}!`, '#25be4d', 3)
  }

  function toggleReminder(index: number) {
    const reminder = reminders.value[index]
    if (!reminder) return
    reminder.enabled = !reminder.enabled
    scheduleReminders()
    showNotification(`Reminder ${reminder.enabled ? 'enabled' : 'disabled'}!`, 'cyan', 3)
  }

  function removeReminder(index: number) {
    reminders.value.splice(index, 1)
    scheduleReminders()
    showNotification('Reminder removed!', 'orange', 3)
  }

  function exportData() {
    const data = {
      dailyGoal: dailyGoal.value,
      hydrationProgress: hydrationProgress.value,
      streak: streak.value,
      dailyStats: { ...dailyStats },
      lastLoggedDay: lastLoggedDay.value,
      reminders: reminders.value,
      smartModeEnabled: smartModeEnabled.value
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'dewlog_data.json'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    showNotification('Data exported successfully!', '#25be4d', 3)
  }

  function importData(file: File) {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const result = e.target?.result
        if (typeof result !== 'string') throw new Error("Invalid file content")

        const importedData = JSON.parse(result)
        dailyGoal.value = importedData.dailyGoal ?? dailyGoal.value
        hydrationProgress.value = importedData.hydrationProgress ?? hydrationProgress.value
        streak.value = importedData.streak ?? streak.value
        lastLoggedDay.value = importedData.lastLoggedDay ?? lastLoggedDay.value
        smartModeEnabled.value = importedData.smartModeEnabled ?? smartModeEnabled.value

        // Merge dailyStats
        Object.assign(dailyStats, importedData.dailyStats ?? {})

        // Merge reminders
        if (Array.isArray(importedData.reminders)) {
          importedData.reminders.forEach((newReminder: Reminder) => {
            const existing = reminders.value.find(r => r.time === newReminder.time)
            if (!existing) {
              reminders.value.push(newReminder)
            } else {
              existing.enabled = newReminder.enabled
            }
          })
          reminders.value.sort((a, b) => a.time.localeCompare(b.time))
        }

        scheduleReminders()
        showNotification('Data imported and merged successfully!', '#25be4d', 3)
      } catch (error) {
        console.error('Import error:', error)
        showNotification('Failed to import data. Invalid file.', 'red', 3)
      }
    }
    reader.readAsText(file)
  }

  return {
    // state
    dailyGoal,
    hydrationProgress,
    streak,
    dailyStats,
    lastLoggedDay,
    selectedDay,
    smartModeEnabled,
    notification,
    reminders,
    _reminderInterval,
    _smartReminderInterval,
    _lastNotificationTime,
    formattedDailyStats,

    // drinks map
    drinks,

    // getters
    progressPercentage,
    goalMet,
    isTodaySelected,
    selectedDayProgress,
    selectedDayGoalMet,
    selectedDayProgressPercentage,
    recentDays,

    // actions
    initializeStore,
    setSelectedDay,
    resetDailyProgress,
    checkStreak,
    scheduleReminders,
    logDrink,
    requestNotificationPermission,
    showNotification,
    toggleSmartMode,
    addReminder,
    toggleReminder,
    removeReminder,
    exportData,
    importData,
  }
}, {
  persist: {
    paths: [
      'dailyGoal',
      'hydrationProgress',
      'streak',
      'dailyStats',
      'lastLoggedDay',
      'reminders',
      'selectedDay',
      'smartModeEnabled'
    ]
  }
} as any)
