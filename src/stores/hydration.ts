import { defineStore, type StoreDefinition } from 'pinia'
import { ref, reactive, computed, type Ref, type Reactive, type ComputedRef } from 'vue'

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

export const useHydrationStore: StoreDefinition = defineStore('hydration', () => {
  const dailyGoal: Ref = ref(8)
  const hydrationProgress: Ref = ref(0)
  const streak: Ref = ref(0)
  const dailyStats: Reactive<Record<string, number>> = reactive<Record<string, number>>({})
  const lastLoggedDay: Ref = ref('')
  const selectedDay: Ref = ref('')
  const smartModeEnabled: Ref = ref(false)
  const notification: Ref = ref<NotificationMessage | null>(null)
  const reminders: Ref = ref<Reminder[]>([])
  const _reminderInterval: Ref = ref<number | null>(null)
  const _smartReminderInterval: Ref = ref<number | null>(null)
  const _lastNotificationTime: Ref = ref<number>(0)
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

  // Getters
  const progressPercentage: ComputedRef<number> = computed(() =>
    Math.min((hydrationProgress.value / dailyGoal.value) * 100, 100)
  )

  const goalMet: ComputedRef<boolean> = computed((): boolean =>
    hydrationProgress.value >= dailyGoal.value
  )

  const isTodaySelected: ComputedRef<boolean> = computed((): boolean =>
    selectedDay.value === getTodayDate()
  )

  const selectedDayProgress: ComputedRef<number> = computed(() =>
    dailyStats[selectedDay.value] || 0
  )

  const selectedDayGoalMet: ComputedRef<boolean> = computed((): boolean =>
    selectedDayProgress.value >= dailyGoal.value
  )

  const selectedDayProgressPercentage: ComputedRef<number> = computed(() =>
    Math.min((selectedDayProgress.value / dailyGoal.value) * 100, 100)
  )

  const recentDays: ComputedRef<any[]> = computed(() => {
    const days: any[] = []
    const today: Date = new Date()

    for (let i: number = 0; i < 7; i++) {
      const d: Date = new Date(today)
      d.setDate(today.getDate() - i)
      const dateString: string = d.toISOString().split('T')[0]
      days.push({
        date: dateString,
        displayDate: i === 0 ? 'Today' : dateString,
        amount: dailyStats[dateString]
      })
    }

    return days
  })

  // Actions
  function logDrink(drinkType: DrinkType, amount: number): void {
    if (isNaN(amount) || amount <= 0) {
      showNotification('Please enter a valid amount!', 'red', 3)
      return
    }
    resetDailyProgress()
    hydrationProgress.value += amount * (drinks[drinkType] ?? 1)
    dailyStats[getTodayDate()] = hydrationProgress.value
    showNotification(`Logged ${amount} cups of ${drinkType}!`, '#25be4d', 2)
  }

  async function requestNotificationPermission(): Promise<void> {
    if (!('Notification' in window)) {
      showNotification('This browser does not support notifications.', 'red', 3)
      return
    }
    const permission: NotificationPermission = await Notification.requestPermission()
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

  function setSelectedDay(date: string): void {
    selectedDay.value = date
  }

  function initializeStore(): void {
    resetDailyProgress()
    checkStreak()
    scheduleReminders()
  }

  function resetDailyProgress(): void {
    const today: string = getTodayDate()
    if (today !== lastLoggedDay.value) {
      checkStreak()
      hydrationProgress.value = 0
      lastLoggedDay.value = today
    }
  }

  function checkStreak(): void {
    const today: string = getTodayDate()
    const prev = lastLoggedDay.value
    if (prev && prev !== today) {
      const progress: number = dailyStats[prev] || 0
      streak.value = progress >= dailyGoal.value ? streak.value + 1 : 0
    } else if (!prev) {
      streak.value = 0
    }
  }

  function scheduleReminders(): void {
    if (_reminderInterval.value) clearInterval(_reminderInterval.value)
    if (_smartReminderInterval.value) clearInterval(_smartReminderInterval.value)

    const sendNotification = (title: string, body: string): void => {
      if (Notification.permission === 'granted') {
        const now: Date = new Date()
        if (!(_lastNotificationTime.value) || now.getTime() - _lastNotificationTime.value > 59000) {
          new Notification(title, {
            body,
            icon: '/Hydration-logo.jpg',
          })
          _lastNotificationTime.value = now.getTime()
        }
      }
    }

    _reminderInterval.value = setInterval((): void => {
      const now: Date = new Date()
      const currentTime: string = now.toTimeString().slice(0, 5)
      reminders.value.forEach((reminder: Reminder): void => {
        if (reminder.enabled && reminder.time === currentTime) {
          sendNotification('Hydration Reminder', 'Time to drink some water!')
        }
      })
    }, 60000)

    if (smartModeEnabled.value) {
      const smartTimes: string[] = ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00']
      _smartReminderInterval.value = setInterval((): void => {
        const now: Date = new Date()
        const currentTime: string = now.toTimeString().slice(0, 5)
        if (smartTimes.includes(currentTime)) {
          sendNotification('Smart Hydration Reminder', 'It\'s a good time for a drink!')
        }
      }, 60000)
    }
  }

  function addReminder(time: string): void {
    if (reminders.value.some((r: Reminder): boolean => r.time === time)) {
      showNotification('Reminder at this time already exists!', 'orange', 3)
      return
    }
    reminders.value.push({ time, enabled: true })
    reminders.value.sort((a: Reminder, b: Reminder) => a.time.localeCompare(b.time))
    scheduleReminders()
    showNotification(`Reminder set for ${time}!`, '#25be4d', 3)
  }

  function toggleReminder(index: number): void {
    const reminder = reminders.value[index]
    if (!reminder) return
    reminder.enabled = !reminder.enabled
    scheduleReminders()
    showNotification(`Reminder ${reminder.enabled ? 'enabled' : 'disabled'}!`, 'cyan', 3)
  }

  function removeReminder(index: number): void {
    reminders.value.splice(index, 1)
    scheduleReminders()
    showNotification('Reminder removed!', 'orange', 3)
  }

  function exportData(): void {
    const data = {
      dailyGoal: dailyGoal.value,
      hydrationProgress: hydrationProgress.value,
      streak: streak.value,
      dailyStats: { ...dailyStats },
      lastLoggedDay: lastLoggedDay.value,
      reminders: reminders.value,
      smartModeEnabled: smartModeEnabled.value
    }
    
    const blob: Blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url: string = URL.createObjectURL(blob)
    const DownloaderA: HTMLAnchorElement = document.createElement('a')
    DownloaderA.href = url
    DownloaderA.download = 'DewLogData.json'
    document.body.appendChild(DownloaderA)
    DownloaderA.click()
    document.body.removeChild(DownloaderA)
    URL.revokeObjectURL(url)
    showNotification('Data exported successfully!', '#25be4d', 3)
  }

  function importData(file: File) {
    const reader: FileReader = new FileReader()
    reader.onload = (e): void => {
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
          importedData.reminders.forEach((newReminder: Reminder): void => {
            const existing = reminders.value.find((r: Reminder): boolean => r.time === newReminder.time)
            if (!existing) {
              reminders.value.push(newReminder)
            } else {
              existing.enabled = newReminder.enabled
            }
          })
          reminders.value.sort((a: Reminder, b: Reminder) => a.time.localeCompare(b.time))
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
    // State
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

    // Drinks map
    drinks,

    // Getters
    progressPercentage,
    goalMet,
    isTodaySelected,
    selectedDayProgress,
    selectedDayGoalMet,
    selectedDayProgressPercentage,
    recentDays,

    // Actions
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
  persist: true
} as any)
