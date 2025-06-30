<template>
  <div class="settings-view">
    <div class="container">
      <h2>Drink Reminders</h2>
      <button @click="requestNotificationPermission">Enable Notifications</button>
      <div class="reminder-input">
        <input type="time" v-model="newReminderTime">
        <button @click="addReminder">Add Reminder</button>
      </div>
      <ul class="reminders-list">
        <li v-for="(reminder, index) in hydrationStore.reminders" :key="index">
          <span>{{ reminder.time }}</span>
          <button @click="toggleReminder(index)">
            {{ reminder.enabled ? 'Disable' : 'Enable' }}
          </button>
          <button @click="removeReminder(index)" class="remove-btn">Remove</button>
        </li>
        <li v-if="hydrationStore.reminders.length === 0">No reminders set.</li>
      </ul>
    </div>

    <div class="container">
      <h2>Data Management</h2>
      <button @click="exportData">Export Data (JSON)</button>
      <label for="import-file" class="file-input-label">Import Data (JSON)</label>
      <input type="file" id="import-file" @change="handleImport" accept="application/json">
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useHydrationStore } from '../stores/hydration.js';

const hydrationStore = useHydrationStore();
const newReminderTime = ref('08:00'); // Default reminder time

const requestNotificationPermission = () => {
  hydrationStore.requestNotificationPermission();
};

const addReminder = () => {
  if (newReminderTime.value) {
    hydrationStore.addReminder(newReminderTime.value);
    newReminderTime.value = '08:00'; // Reset to default after adding
  } else {
    hydrationStore.showNotification('Please select a time for the reminder.', 'orange', 3);
  }
};

const toggleReminder = (index) => {
  hydrationStore.toggleReminder(index);
};

const removeReminder = (index) => {
  hydrationStore.removeReminder(index);
};

const exportData = () => {
  hydrationStore.exportData();
};

const handleImport = (event) => {
  const file = event.target.files[0];
  if (file) {
    hydrationStore.importData(file);
  }
};
</script>

<style scoped>
.reminder-input {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}

.reminders-list {
  list-style: none;
  padding: 0;
  margin-top: 1rem;
}

.reminders-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.reminders-list li:last-child {
  border-bottom: none;
}

.reminders-list button {
  margin-left: 0.5rem;
  padding: 0.3rem 0.6rem;
  font-size: small;
}

.reminders-list .remove-btn {
  background-color: #ff4d4d;
  color: white;
}

.file-input-label {
  display: inline-block;
  padding: 0.5rem 0.75rem;
  font-size: medium;
  background: var(--foreground-color);
  color: var(--text-color);
  border: none;
  cursor: pointer;
  border-radius: 0.75rem;
  transition: 0.2s ease-in-out;
  backdrop-filter: blur(1rem);
  -webkit-backdrop-filter: blur(1rem);
  margin-top: 1rem;
}

#import-file {
  display: none; /* Hide the actual file input */
}
</style>
