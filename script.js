// إدارة حالة التطبيق
class TodoApp {
  constructor() {
    this.tasks = []
    this.currentFilter = "all"
    this.settings = {
      theme: "dark",
      bgColor: "#0a0a0a",
      primaryColor: "#8b5cf6",
      fontSize: 16,
      backgroundImage: null,
      animationsEnabled: true,
    }

    this.init()
  }

  // تهيئة التطبيق
  init() {
    this.loadData()
    this.bindEvents()
    this.applySettings()
    this.renderTasks()
    this.updateStats()
  }

  // ربط الأحداث
  bindEvents() {
    // إضافة مهمة جديدة
    document.getElementById("addTaskBtn").addEventListener("click", () => this.addTask())
    document.getElementById("taskInput").addEventListener("keypress", (e) => {
      if (e.key === "Enter") this.addTask()
    })

    // فلاتر المهام
    document.querySelectorAll(".filter-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => this.setFilter(e.target.dataset.filter))
    })

    // أزرار الإعدادات
    document.getElementById("settingsBtn").addEventListener("click", () => this.openCustomizationPanel())
    document.getElementById("floatingSettingsBtn").addEventListener("click", () => this.openCustomizationPanel())
    document.getElementById("closePanelBtn").addEventListener("click", () => this.closeCustomizationPanel())
    document.getElementById("panelOverlay").addEventListener("click", () => this.closeCustomizationPanel())

    // إعدادات التخصيص
    this.bindCustomizationEvents()
  }

  // ربط أحداث التخصيص
  bindCustomizationEvents() {
    // الثيمات
    document.querySelectorAll(".theme-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => this.setTheme(e.target.dataset.theme))
    })

    // الألوان
    document.getElementById("bgColorPicker").addEventListener("change", (e) => {
      this.settings.bgColor = e.target.value
      this.applySettings()
      this.saveSettings()
    })

    document.getElementById("primaryColorPicker").addEventListener("change", (e) => {
      this.settings.primaryColor = e.target.value
      this.applySettings()
      this.saveSettings()
    })

    // حجم الخط
    document.getElementById("fontSizeSlider").addEventListener("input", (e) => {
      this.settings.fontSize = Number.parseInt(e.target.value)
      document.getElementById("fontSizeValue").textContent = e.target.value + "px"
      this.applySettings()
      this.saveSettings()
    })

    // صورة الخلفية
    document.getElementById("backgroundImageInput").addEventListener("change", (e) => {
      const file = e.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          this.settings.backgroundImage = e.target.result
          this.applySettings()
          this.saveSettings()
        }
        reader.readAsDataURL(file)
      }
    })

    document.getElementById("removeBackgroundBtn").addEventListener("click", () => {
      this.settings.backgroundImage = null
      document.getElementById("backgroundImageInput").value = ""
      this.applySettings()
      this.saveSettings()
    })

    // الحركات
    document.getElementById("animationToggle").addEventListener("change", (e) => {
      this.settings.animationsEnabled = e.target.checked
      this.applySettings()
      this.saveSettings()
    })

    // إعادة تعيين
    document.getElementById("resetSettingsBtn").addEventListener("click", () => this.resetSettings())
  }

  // إضافة مهمة جديدة
  addTask() {
    const input = document.getElementById("taskInput")
    const priority = document.getElementById("prioritySelect").value
    const text = input.value.trim()

    if (!text) return

    const task = {
      id: Date.now(),
      text: text,
      completed: false,
      priority: priority,
      createdAt: new Date().toISOString(),
    }

    this.tasks.unshift(task)
    input.value = ""

    this.saveTasks()
    this.renderTasks()
    this.updateStats()

    // تأثير بصري
    this.showNotification("تم إضافة المهمة بنجاح!", "success")
  }

  // تبديل حالة المهمة
  toggleTask(id) {
    const task = this.tasks.find((t) => t.id === id)
    if (task) {
      task.completed = !task.completed
      this.saveTasks()
      this.renderTasks()
      this.updateStats()

      const message = task.completed ? "تم إكمال المهمة!" : "تم إلغاء إكمال المهمة!"
      this.showNotification(message, task.completed ? "success" : "info")
    }
  }

  // حذف مهمة
  deleteTask(id) {
    if (confirm("هل أنت متأكد من حذف هذه المهمة؟")) {
      this.tasks = this.tasks.filter((t) => t.id !== id)
      this.saveTasks()
      this.renderTasks()
      this.updateStats()
      this.showNotification("تم حذف المهمة!", "error")
    }
  }

  // تعديل مهمة
  editTask(id) {
    const task = this.tasks.find((t) => t.id === id)
    if (task) {
      const newText = prompt("تعديل المهمة:", task.text)
      if (newText && newText.trim()) {
        task.text = newText.trim()
        this.saveTasks()
        this.renderTasks()
        this.showNotification("تم تعديل المهمة!", "info")
      }
    }
  }

  // تعيين الفلتر
  setFilter(filter) {
    this.currentFilter = filter

    // تحديث أزرار الفلتر
    document.querySelectorAll(".filter-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.filter === filter)
    })

    this.renderTasks()
  }

  // عرض المهام
  renderTasks() {
    const container = document.getElementById("tasksContainer")
    const filteredTasks = this.getFilteredTasks()

    if (filteredTasks.length === 0) {
      container.innerHTML = `
                <div class="empty-message">
                    <i class="fas fa-clipboard-list"></i>
                    ${this.getEmptyMessage()}
                </div>
            `
      return
    }

    container.innerHTML = filteredTasks
      .map(
        (task) => `
            <div class="task-item ${task.completed ? "completed" : ""}" data-id="${task.id}">
                <div class="task-checkbox ${task.completed ? "checked" : ""}" onclick="app.toggleTask(${task.id})"></div>
                <div class="task-content">
                    <div class="task-text" onclick="app.editTask(${task.id})">${task.text}</div>
                    <div class="task-meta">
                        <span class="priority-badge priority-${task.priority}">
                            ${this.getPriorityText(task.priority)}
                        </span>
                        <span class="task-date">${this.formatDate(task.createdAt)}</span>
                    </div>
                </div>
                <div class="task-actions">
                    <button class="task-action-btn" onclick="app.deleteTask(${task.id})" title="حذف">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `,
      )
      .join("")
  }

  // الحصول على المهام المفلترة
  getFilteredTasks() {
    switch (this.currentFilter) {
      case "active":
        return this.tasks.filter((task) => !task.completed)
      case "completed":
        return this.tasks.filter((task) => task.completed)
      default:
        return this.tasks
    }
  }

  // رسالة القائمة الفارغة
  getEmptyMessage() {
    switch (this.currentFilter) {
      case "active":
        return "لا توجد مهام نشطة"
      case "completed":
        return "لا توجد مهام مكتملة"
      default:
        return "لا توجد مهام بعد. أضف مهمة جديدة للبدء!"
    }
  }

  // تحديث الإحصائيات
  updateStats() {
    const total = this.tasks.length
    const completed = this.tasks.filter((t) => t.completed).length
    const active = total - completed

    document.getElementById("totalTasks").textContent = total
    document.getElementById("activeTasks").textContent = active
    document.getElementById("completedTasks").textContent = completed
  }

  // فتح لوحة التخصيص
  openCustomizationPanel() {
    document.getElementById("customizationPanel").classList.add("open")
    document.getElementById("panelOverlay").classList.add("active")
    document.body.style.overflow = "hidden"
  }

  // إغلاق لوحة التخصيص
  closeCustomizationPanel() {
    document.getElementById("customizationPanel").classList.remove("open")
    document.getElementById("panelOverlay").classList.remove("active")
    document.body.style.overflow = "auto"
  }

  // تعيين الثيم
  setTheme(theme) {
    this.settings.theme = theme

    // تحديث أزرار الثيم
    document.querySelectorAll(".theme-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.theme === theme)
    })

    // تطبيق ألوان الثيم
    switch (theme) {
      case "dark":
        this.settings.bgColor = "#0a0a0a"
        this.settings.primaryColor = "#8b5cf6"
        break
      case "purple":
        this.settings.bgColor = "#1a0a2e"
        this.settings.primaryColor = "#8b5cf6"
        break
      case "blue":
        this.settings.bgColor = "#0a1a2e"
        this.settings.primaryColor = "#3b82f6"
        break
    }

    // تحديث منتقيات الألوان
    document.getElementById("bgColorPicker").value = this.settings.bgColor
    document.getElementById("primaryColorPicker").value = this.settings.primaryColor

    this.applySettings()
    this.saveSettings()
  }

  // تطبيق الإعدادات
  applySettings() {
    const root = document.documentElement

    // تطبيق الألوان
    root.style.setProperty("--bg-color", this.settings.bgColor)
    root.style.setProperty("--primary-color", this.settings.primaryColor)
    root.style.setProperty("--font-size", this.settings.fontSize + "px")

    // تطبيق صورة الخلفية
    if (this.settings.backgroundImage) {
      document.body.style.backgroundImage = `url(${this.settings.backgroundImage})`
      document.body.style.backgroundSize = "cover"
      document.body.style.backgroundPosition = "center"
      document.body.style.backgroundAttachment = "fixed"
    } else {
      document.body.style.backgroundImage = "none"
    }

    // تطبيق الحركات
    if (!this.settings.animationsEnabled) {
      document.body.classList.add("no-animations")
    } else {
      document.body.classList.remove("no-animations")
    }

    // تحديث شريط حجم الخط
    document.getElementById("fontSizeSlider").value = this.settings.fontSize
    document.getElementById("fontSizeValue").textContent = this.settings.fontSize + "px"

    // تحديث مفتاح الحركات
    document.getElementById("animationToggle").checked = this.settings.animationsEnabled
  }

  // إعادة تعيين الإعدادات
  resetSettings() {
    if (confirm("هل أنت متأكد من إعادة تعيين جميع الإعدادات؟")) {
      this.settings = {
        theme: "dark",
        bgColor: "#0a0a0a",
        primaryColor: "#8b5cf6",
        fontSize: 16,
        backgroundImage: null,
        animationsEnabled: true,
      }

      document.getElementById("backgroundImageInput").value = ""
      this.applySettings()
      this.saveSettings()
      this.showNotification("تم إعادة تعيين الإعدادات!", "info")
    }
  }

  // عرض إشعار
  showNotification(message, type = "info") {
    const notification = document.createElement("div")
    notification.className = `notification notification-${type}`
    notification.innerHTML = `
            <i class="fas fa-${this.getNotificationIcon(type)}"></i>
            ${message}
        `

    // إضافة أنماط الإشعار
    notification.style.cssText = `
            position: fixed;
            top: 2rem;
            right: 2rem;
            background: var(--card-bg);
            border: 1px solid var(--border-color);
            border-radius: var(--border-radius);
            padding: 1rem 1.5rem;
            color: var(--text-color);
            box-shadow: var(--shadow);
            z-index: 10000;
            animation: slideInRight 0.3s ease-out;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            max-width: 300px;
        `

    // ألوان حسب النوع
    switch (type) {
      case "success":
        notification.style.borderColor = "var(--success-color)"
        break
      case "error":
        notification.style.borderColor = "var(--danger-color)"
        break
      case "info":
        notification.style.borderColor = "var(--primary-color)"
        break
    }

    document.body.appendChild(notification)

    // إزالة الإشعار بعد 3 ثوان
    setTimeout(() => {
      notification.style.animation = "slideOutRight 0.3s ease-out"
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification)
        }
      }, 300)
    }, 3000)
  }

  // أيقونة الإشعار
  getNotificationIcon(type) {
    switch (type) {
      case "success":
        return "check-circle"
      case "error":
        return "exclamation-circle"
      case "info":
        return "info-circle"
      default:
        return "bell"
    }
  }

  // نص الأولوية
  getPriorityText(priority) {
    switch (priority) {
      case "low":
        return "منخفضة"
      case "medium":
        return "متوسطة"
      case "high":
        return "عالية"
      default:
        return "عادية"
    }
  }

  // تنسيق التاريخ
  formatDate(dateString) {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now - date)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) return "اليوم"
    if (diffDays === 2) return "أمس"
    if (diffDays <= 7) return `منذ ${diffDays} أيام`

    return date.toLocaleDateString("ar-SA")
  }

  // حفظ المهام
  saveTasks() {
    localStorage.setItem("professional-todos", JSON.stringify(this.tasks))
  }

  // حفظ الإعدادات
  saveSettings() {
    localStorage.setItem("customization-settings", JSON.stringify(this.settings))
  }

  // تحميل البيانات
  loadData() {
    // تحميل المهام
    const savedTasks = localStorage.getItem("professional-todos")
    if (savedTasks) {
      this.tasks = JSON.parse(savedTasks)
    }

    // تحميل الإعدادات
    const savedSettings = localStorage.getItem("customization-settings")
    if (savedSettings) {
      this.settings = { ...this.settings, ...JSON.parse(savedSettings) }
    }
  }
}

// إضافة أنماط الحركات للإشعارات
const notificationStyles = document.createElement("style")
notificationStyles.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100px);
        }
    }
`
document.head.appendChild(notificationStyles)

// تهيئة التطبيق عند تحميل الصفحة
let app
document.addEventListener("DOMContentLoaded", () => {
  app = new TodoApp()
})

// منع إعادة تحميل الصفحة عند الإرسال
document.addEventListener("submit", (e) => {
  e.preventDefault()
})
