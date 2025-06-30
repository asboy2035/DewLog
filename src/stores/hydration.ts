import { defineStore } from 'pinia'

export const useHydrationStore = defineStore('hydration', {
  state: () => ({
    dailyGoal: 8,
    hydrationProgress: 0,
    streak: 0,
    dailyStats: {}, // Stores daily hydration progress: { 'YYYY-MM-DD': cups }
    lastLoggedDay: '',
    drinks: {
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
    },
    notification: null, // { message: '', color: '', timeout: 0 }
    reminders: [], // Array of { time: 'HH:MM', enabled: true }
  }),
  getters: {
    // Calculate the percentage of daily goal achieved
    progressPercentage: (state) => {
      return Math.min((state.hydrationProgress / state.dailyGoal) * 100, 100)
    },
    // Check if the daily goal has been met
    goalMet: (state) => {
      return state.hydrationProgress >= state.dailyGoal
    },
    // Get formatted daily stats for display
    formattedDailyStats: (state) => {
      return Object.keys(state.dailyStats)
        .sort((a, b) => new Date(b) - new Date(a)) // Sort by date descending
        .map(date => ({
          date: date,
          amount: state.dailyStats[date]
        }))
    }
  },
  actions: {
    // Initialize store state from localStorage
    initializeStore() {
      this.dailyGoal = JSON.parse(localStorage.getItem('dailyGoal')) || 8
      this.hydrationProgress = JSON.parse(localStorage.getItem('hydrationProgress')) || 0
      this.streak = JSON.parse(localStorage.getItem('streak')) || 0
      this.dailyStats = JSON.parse(localStorage.getItem('dailyStats')) || {}
      this.lastLoggedDay = localStorage.getItem('lastLoggedDay') || new Date().toLocaleDateString()
      this.reminders = JSON.parse(localStorage.getItem('reminders')) || []

      this.resetDailyProgress()
      this.scheduleReminders()
    },

    // Save state to localStorage
    saveState() {
      localStorage.setItem('dailyGoal', JSON.stringify(this.dailyGoal))
      localStorage.setItem('hydrationProgress', JSON.stringify(this.hydrationProgress))
      localStorage.setItem('streak', JSON.stringify(this.streak))
      localStorage.setItem('dailyStats', JSON.stringify(this.dailyStats))
      localStorage.setItem('lastLoggedDay', this.lastLoggedDay)
      localStorage.setItem('reminders', JSON.stringify(this.reminders))
    },

    // Log a drink
    logDrink(drinkType, amount) {
      if (isNaN(amount) || amount <= 0) {
        this.showNotification('Please enter a valid amount!', 'red', 3)
        return
      }

      this.resetDailyProgress() // Ensure daily reset before logging
      this.hydrationProgress += amount * this.drinks[drinkType]
      this.saveState()
      this.updateDailyStats() // Update daily stats after logging
    },

    // Update daily goal
    setDailyGoal(goal) {
      this.dailyGoal = parseFloat(goal)
      this.saveState()
    },

    // Reset daily progress at the start of a new day
    resetDailyProgress() {
      const currentDate = new Date().toLocaleDateString()
      if (currentDate !== this.lastLoggedDay) {
        if (this.hydrationProgress < this.dailyGoal) {
          this.streak = 0 // Reset streak if goal wasn't met
        } else {
          this.streak += 1 // Increment streak if goal was met
        }

        this.hydrationProgress = 0 // Reset hydration progress
        this.lastLoggedDay = currentDate // Update last logged day
        this.saveState()
      }
    },

    // Update daily stats (for the stats page)
    updateDailyStats() {
      const today = new Date().toLocaleDateString()
      this.dailyStats[today] = this.hydrationProgress
      this.saveState()
    },

    // Show a custom notification
    showNotification(message, color = 'cyan', timeout = 2) {
      this.notification = { message, color, timeout }
      // Clear notification after timeout
      setTimeout(() => {
        this.notification = null
      }, timeout * 1000)
    },

    // Request notification permission and subscribe for push notifications
    async requestNotificationPermission() {
      if (!('Notification' in window)) {
        this.showNotification('This browser does not support notifications.', 'red', 3)
        return
      }

      const permission = await Notification.requestPermission()
      if (permission === 'granted') {
        this.showNotification('Notification permission granted!', '#25be4d', 3)
        // Subscribe for push notifications (if needed for server-side pushes)
        // This example focuses on client-side scheduled notifications
      } else {
        this.showNotification('Notification permission denied.', 'red', 3)
      }
    },

    // Add a new reminder
    addReminder(time) {
      if (this.reminders.some(r => r.time === time)) {
        this.showNotification('Reminder at this time already exists!', 'orange', 3)
        return
      }
      this.reminders.push({ time, enabled: true })
      this.reminders.sort((a, b) => a.time.localeCompare(b.time)) // Sort reminders
      this.saveState()
      this.scheduleReminders()
      this.showNotification(`Reminder set for ${time}!`, '#25be4d', 3)
    },

    // Toggle reminder enabled status
    toggleReminder(index) {
      this.reminders[index].enabled = !this.reminders[index].enabled
      this.saveState()
      this.scheduleReminders() // Reschedule reminders after change
      this.showNotification(`Reminder ${this.reminders[index].enabled ? 'enabled' : 'disabled'}!`, 'cyan', 3)
    },

    // Remove a reminder
    removeReminder(index) {
      this.reminders.splice(index, 1)
      this.saveState()
      this.scheduleReminders() // Reschedule reminders after removal
      this.showNotification('Reminder removed!', 'orange', 3)
    },

    // Schedule client-side push notifications for reminders
    scheduleReminders() {
      // Clear any existing reminders to avoid duplicates
      if (this._reminderInterval) {
        clearInterval(this._reminderInterval)
      }

      // Schedule new reminders
      this._reminderInterval = setInterval(() => {
        const now = new Date()
        const currentHour = now.getHours().toString().padStart(2, '0')
        const currentMinute = now.getMinutes().toString().padStart(2, '0')
        const currentTime = `${currentHour}:${currentMinute}`

        this.reminders.forEach(reminder => {
          if (reminder.enabled && reminder.time === currentTime) {
            // Check if notification has been sent recently to avoid multiple notifications within the same minute
            if (!this._lastNotificationTime || (now.getTime() - this._lastNotificationTime > 59 * 1000)) {
              new Notification('Hydration Reminder', {
                body: 'Time to drink some water!',
                icon: '/Hydration-logo.jpg',
                vibrate: [200, 100, 200]
              })
              this._lastNotificationTime = now.getTime()
            }
          }
        })
      }, 60 * 1000) // Check every minute
    },

    // Export all data to a JSON file
    exportData() {
      const data = {
        dailyGoal: this.dailyGoal,
        hydrationProgress: this.hydrationProgress,
        streak: this.streak,
        dailyStats: this.dailyStats,
        lastLoggedDay: this.lastLoggedDay,
        reminders: this.reminders,
      }
      const dataStr = JSON.stringify(data, null, 2)
      const blob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'hydroflow_data.json'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      this.showNotification('Data exported successfully!', '#25be4d', 3)
    },

    // Import and merge data from a JSON file
    importData(file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target.result)

          // Merge logic: Prioritize imported data, but merge dailyStats and reminders
          this.dailyGoal = importedData.dailyGoal !== undefined ? importedData.dailyGoal : this.dailyGoal
          this.hydrationProgress = importedData.hydrationProgress !== undefined ? importedData.hydrationProgress : this.hydrationProgress
          this.streak = importedData.streak !== undefined ? importedData.streak : this.streak
          this.lastLoggedDay = importedData.lastLoggedDay !== undefined ? importedData.lastLoggedDay : this.lastLoggedDay

          // Merge dailyStats: combine entries, prioritizing imported if dates overlap
          if (importedData.dailyStats) {
            this.dailyStats = { ...this.dailyStats, ...importedData.dailyStats }
          }

          // Merge reminders: add new unique reminders, keep existing enabled status
          if (importedData.reminders && Array.isArray(importedData.reminders)) {
            importedData.reminders.forEach(newReminder => {
              const existingReminder = this.reminders.find(r => r.time === newReminder.time)
              if (!existingReminder) {
                this.reminders.push(newReminder)
              } else {
                // Optionally update existing reminder's enabled status if imported is different
                existingReminder.enabled = newReminder.enabled
              }
            })
            this.reminders.sort((a, b) => a.time.localeCompare(b.time))
          }

          this.saveState()
          this.scheduleReminders() // Reschedule reminders after import
          this.showNotification('Data imported and merged successfully!', '#25be4d', 3)
          // Force a re-render of components that depend on these states if necessary
          // (Pinia handles reactivity, so direct re-render might not be needed)
        } catch (error) {
          console.error('Error importing data:', error)
          this.showNotification('Failed to import data. Invalid JSON file.', 'red', 3)
        }
      }
      reader.readAsText(file)
    }
  }
})
