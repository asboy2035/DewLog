<template>
  <div class="settings-view">
    <card>
      <h2>Drink Reminders</h2>
      <button @click="requestNotificationPermission">
        <Icon icon="solar:bell-line-duotone" />
        Enable Notifications
      </button>

      <div class="reminder-input">
        <input type="time" v-model="newReminderTime">
        <button @click="addReminder">
          <Icon icon="solar:add-circle-line-duotone" />
          Add Reminder
        </button>
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
    </card>

    <card>
      <h2>Smart Mode Notifications</h2>
      <div class="smart-mode-toggle">
        <span>Enable Smart Reminders (Every 2 hours, 8 AM - 8 PM)</span>
        <label class="switch">
          <input type="checkbox" v-model="hydrationStore.smartModeEnabled" @change="hydrationStore.toggleSmartMode">
          <span class="slider round"></span>
        </label>
      </div>
    </card>

    <card>
      <h2>Data Management</h2>

      <div class="flexRow spaced">
        <button @click="exportData">
          <Icon icon="solar:square-share-line-line-duotone" />
          Export Data (JSON)
        </button>
        <label for="import-file" class="file-input-label">
          <button @click="exportData">
            <Icon icon="solar:download-line-duotone" />
            Import Data
          </button>
        </label>
        <input type="file" id="import-file" @change="handleImport" accept="application/json">
      </div>
    </card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useHydrationStore } from '../stores/hydration.ts'
import { Icon } from '@iconify/vue'
import Card from '../components/Card.vue'

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
  opacity: 1;
}

#import-file {
  display: none; /* Hide the actual file input */
}

/* Styles for the toggle switch */
.smart-mode-toggle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 1rem;
  padding: 0.5rem 0;
}

.switch {
  position: relative;
  display: inline-block;
  width: 40px;
  height: 24px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: .4s;
  transition: .4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  -webkit-transition: .4s;
  transition: .4s;
}

input:checked + .slider {
  background-color: var(--primary-color);
}

input:focus + .slider {
  box-shadow: 0 0 1px var(--primary-color);
}

input:checked + .slider:before {
  -webkit-transform: translateX(16px);
  -ms-transform: translateX(16px);
  transform: translateX(16px);
}

/* Rounded sliders */
.slider.round {
  border-radius: 24px;
}

.slider.round:before {
  border-radius: 50%;
}
.settings-view {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
</style>
