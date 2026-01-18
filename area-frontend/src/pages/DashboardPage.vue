<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/20 to-white font-sans selection:bg-primary-100 selection:text-primary-700 transition-colors duration-200 relative">
    <!-- Dashboard Background -->
    <DashboardBackground />
    
    <!-- Navigation (Glass Effect) -->
    <nav class="nav-area backdrop-blur-xl bg-white/70 border-b border-purple-100/50 shadow-sm">
      <div class="container-area">
        <div class="flex justify-between h-20 items-center">
          <div class="flex items-center cursor-pointer group" @click="resetView">
            <div class="relative">
              <div class="absolute inset-0 bg-primary-500 blur opacity-20 group-hover:opacity-40 transition-opacity duration-300 rounded-lg"></div>
              <div class="relative inline-flex items-center justify-center w-20 h-10 bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl mr-3 shadow-primary">
                <span class="text-xl font-bold text-white">AREA</span>
              </div>
            </div>
          </div>
          
          <!-- Center Navigation Links -->
          <div class="hidden md:flex items-center space-x-1">
            <router-link to="/services" class="nav-link">
              <Layers :size="18" class="mr-2" />
              Services
            </router-link>
            <router-link to="/oauth" class="nav-link">
              <Shield :size="18" class="mr-2" />
              Connections
            </router-link>
            <router-link to="/help" class="nav-link">
              <HelpCircle :size="18" class="mr-2" />
              Help
            </router-link>
          </div>
          
          <div class="flex items-center space-x-4">
            <button 
              v-if="!isCreating"
              @click="startCreation"
              class="btn-area-primary rounded-full"
            >
              <Plus :size="18" class="mr-2 transition-transform group-hover:rotate-90" />
              Create Area
            </button>
            <button 
              v-else
              @click="cancelCreation"
              class="text-surface-500 hover:text-surface-800 dark:hover:text-white px-4 py-2 rounded-full text-sm font-medium transition-colors hover:bg-surface-100 dark:hover:bg-surface-700"
            >
              Cancel
            </button>
            
            <div class="h-8 w-px bg-surface-200 dark:bg-surface-700"></div>
            
            <!-- User Menu -->
            <div class="relative" ref="userMenuRef">
              <button 
                @click="showUserMenu = !showUserMenu"
                class="flex items-center gap-2 p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
              >
                <div class="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-sm font-bold">
                  {{ userInitials }}
                </div>
                <ChevronDown :size="16" class="text-surface-400 hidden sm:block" />
              </button>
              
              <!-- Dropdown Menu -->
              <div 
                v-if="showUserMenu"
                class="absolute right-0 mt-2 w-56 bg-white dark:bg-surface-800 rounded-xl shadow-lg border border-surface-200 dark:border-surface-700 py-2 z-50"
              >
                <div class="px-4 py-3 border-b border-surface-100 dark:border-surface-700">
                  <p class="text-sm font-medium text-surface-900 dark:text-white">{{ userEmail }}</p>
                  <p class="text-xs text-surface-500">Signed in</p>
                </div>
                <router-link to="/profile" class="dropdown-item" @click="showUserMenu = false">
                  <User :size="16" />
                  Profile
                </router-link>
                <router-link to="/settings" class="dropdown-item" @click="showUserMenu = false">
                  <Settings :size="16" />
                  Settings
                </router-link>
                <router-link to="/oauth" class="dropdown-item" @click="showUserMenu = false">
                  <Shield :size="16" />
                  Connections
                </router-link>
                <div class="border-t border-surface-100 dark:border-surface-700 mt-2 pt-2">
                  <button @click="logout" class="dropdown-item text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 w-full">
                    <LogOut :size="16" />
                    Logout
                  </button>
                </div>
              </div>
            </div>

            <!-- Mobile Menu Button -->
            <button 
              @click="isMobileMenuOpen = !isMobileMenuOpen"
              class="md:hidden p-2 text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-lg transition-colors"
            >
              <Menu v-if="!isMobileMenuOpen" :size="24" />
              <X v-else :size="24" />
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile Menu Overlay -->
      <div 
        v-if="isMobileMenuOpen" 
        class="md:hidden absolute top-20 left-0 w-full bg-white/95 dark:bg-surface-900/95 backdrop-blur-xl border-b border-surface-200 dark:border-surface-700 shadow-lg animate-fade-in z-40"
      >
        <div class="container-area py-4 space-y-2">
          <router-link 
            to="/services" 
            class="flex items-center gap-3 px-4 py-3 text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-xl transition-colors"
            @click="isMobileMenuOpen = false"
          >
            <Layers :size="20" />
            <span class="font-medium">Services</span>
          </router-link>
          <router-link 
            to="/oauth" 
            class="flex items-center gap-3 px-4 py-3 text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-xl transition-colors"
            @click="isMobileMenuOpen = false"
          >
            <Shield :size="20" />
            <span class="font-medium">Connections</span>
          </router-link>
          <router-link 
            to="/help" 
            class="flex items-center gap-3 px-4 py-3 text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-xl transition-colors"
            @click="isMobileMenuOpen = false"
          >
            <HelpCircle :size="20" />
            <span class="font-medium">Help</span>
          </router-link>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      
      <!-- Dashboard View (List of Areas) -->
      <div v-if="!isCreating" class="space-y-8 animate-fade-in">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-surface-900 dark:text-white">My Areas</h1>
            <p class="text-surface-500 dark:text-surface-400 mt-2">Manage your automated workflows</p>
          </div>
          <button
            @click="toggleDarkMode"
            class="p-2.5 rounded-lg bg-surface-100 hover:bg-surface-200 dark:bg-surface-800 dark:hover:bg-surface-700 transition-colors"
            title="Toggle dark mode"
          >
            <component :is="isDarkMode ? Sun : Moon" :size="20" class="text-surface-600 dark:text-surface-300" />
          </button>
        </div>

        <!-- Filters and Search -->
        <div class="card-area p-4 space-y-4">
          <div class="flex flex-col sm:flex-row gap-4">
            <!-- Search -->
            <div class="flex-1 relative">
              <Search :size="18" class="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400" />
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search areas by name..."
                class="input-area pl-12"
              />
            </div>
            
            <!-- Status Filter -->
            <select
              v-model="statusFilter"
              class="input-area w-auto"
            >
              <option value="all">All Status</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
          </div>
          
          <!-- Results Info -->
          <div class="text-sm text-surface-500 dark:text-surface-400 flex items-center justify-between">
            <span>{{ filteredAreas.length }} area(s) found</span>
            <button
              v-if="searchQuery || statusFilter !== 'all'"
              @click="clearFilters"
              class="text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 font-medium transition-colors"
            >
              Clear filters
            </button>
          </div>
        </div>
        
        <!-- Areas List -->
        <div v-if="isLoadingAreas" class="flex items-center justify-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>

        <div v-else-if="userAreas.length === 0" class="relative overflow-hidden card-area p-12 text-center group">
          <div class="absolute inset-0 bg-gradient-to-br from-primary-50/50 to-secondary-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div class="relative z-10 flex flex-col items-center">
            <h3 class="text-xl font-semibold text-surface-900 dark:text-white mb-2">No Areas configured yet</h3>
            <p class="text-surface-500 max-w-md mx-auto mb-8">Start automating your tasks by connecting your favorite services together.</p>
            <button @click="startCreation" class="text-primary-600 font-semibold hover:text-primary-800 flex items-center gap-2 transition-all hover:gap-3">
              Create your first automation <ArrowRight :size="18" />
            </button>
          </div>
        </div>

        <div v-else class="space-y-4">
          <template v-for="area in filteredAreas" :key="area?.id || Math.random()">
            <div 
              v-if="area"
              class="card-area-interactive p-6"
            >
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="flex items-center gap-3 mb-2">
                  <h3 class="text-xl font-bold text-surface-900 dark:text-white">{{ area.name }}</h3>
                  <span 
                    class="badge-area"
                    :class="area.is_active ? 'badge-area-success' : 'bg-surface-100 text-surface-600 dark:bg-surface-700 dark:text-surface-400'"
                  >
                    {{ area.is_active ? 'Active' : 'Inactive' }}
                  </span>
                </div>
                <p v-if="area.description" class="text-surface-600 dark:text-surface-400 mb-4">{{ area.description }}</p>
                
                <div class="flex items-center gap-4 text-sm">
                  <div class="flex items-center gap-2">
                    <div class="w-8 h-8 bg-secondary-100 dark:bg-secondary-900/50 rounded-lg flex items-center justify-center">
                      <span class="text-xs font-bold text-secondary-700 dark:text-secondary-400">IF</span>
                    </div>
                    <span class="text-surface-600 dark:text-surface-400">{{ area.service_action || area.action_name || 'Action' }}</span>
                  </div>
                  <ArrowRight :size="16" class="text-surface-400" />
                  <div class="flex items-center gap-2">
                    <div class="w-8 h-8 bg-primary-100 dark:bg-primary-900/50 rounded-lg flex items-center justify-center">
                      <span class="text-xs font-bold text-primary-700 dark:text-primary-400">THEN</span>
                    </div>
                    <span class="text-surface-600 dark:text-surface-400">{{ area.service_reaction || area.reaction_name || 'Reaction' }}</span>
                  </div>
                </div>
              </div>

              <div class="flex items-center gap-2">
                <button
                  @click="openHistory(area)"
                  title="View History"
                  class="p-2 text-secondary-600 dark:text-secondary-400 hover:bg-secondary-50 dark:hover:bg-secondary-900/30 rounded-lg transition-colors"
                >
                  <History :size="20" />
                </button>
                <button
                  @click="toggleAreaStatus(area)"
                  :title="area.is_active ? 'Pause' : 'Run'"
                  class="p-2 rounded-lg transition-colors"
                  :class="area.is_active ? 'text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/30' : 'text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30'"
                >
                  <component :is="area.is_active ? Pause : Play" :size="20" />
                </button>
                <button
                  @click="editArea(area)"
                  title="Edit"
                  class="p-2 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded-lg transition-colors"
                >
                  <Edit :size="20" />
                </button>
                <button
                  @click="confirmDeleteArea(area)"
                  title="Delete"
                  class="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                >
                  <Trash2 :size="20" />
                </button>
              </div>
            </div>

            <div v-if="area.last_triggered" class="mt-4 pt-4 border-t border-surface-100 dark:border-surface-700 text-xs text-surface-500">
              Last triggered: {{ formatDate(area.last_triggered) }}
            </div>
          </div>
          </template>
        </div>
      </div>

      <!-- Create Area View (Clean Layout) -->
      <div v-else class="animate-fade-in pb-20 max-w-4xl mx-auto">
        <!-- Header -->
        <div class="flex items-center justify-between mb-8 sticky top-24 z-40 bg-white/95 dark:bg-surface-900/95 backdrop-blur py-4 border-b border-surface-200 dark:border-surface-700 rounded-xl px-6 shadow-sm">
          <div>
            <h1 class="text-2xl font-bold text-surface-900 dark:text-white">New Automation</h1>
            <p class="text-sm text-surface-500 mt-1">Configure your trigger and reactions</p>
          </div>
          <button 
            @click="saveArea"
            :disabled="!canSaveArea || isSaving"
            class="btn-area-primary"
          >
            <CheckCircle v-if="!isSaving" :size="18" class="mr-2" />
            <span v-if="isSaving" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
            {{ isSaving ? 'Saving...' : 'Save Area' }}
          </button>
        </div>

        <div class="space-y-8">
          <!-- 1. Basic Information -->
          <div class="card-area p-8">
            <h2 class="text-xl font-bold text-surface-900 dark:text-white mb-6 flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-surface-100 dark:bg-surface-800 flex items-center justify-center text-sm font-bold text-surface-600 dark:text-surface-400">1</div>
              Basic Information
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="label">Area Name *</label>
                <input 
                  v-model="areaConfig.name"
                  type="text" 
                  placeholder="e.g., Github to Discord notifier"
                  class="input-area"
                  required
                />
              </div>
              <div>
                <label class="label">Description (optional)</label>
                <input 
                  v-model="areaConfig.description"
                  type="text"
                  placeholder="Describe what this automation does..."
                  class="input-area"
                />
              </div>
            </div>
          </div>

          <!-- 2. Trigger (If This) -->
          <div class="card-area p-8 border-l-4 border-l-secondary-500">
            <h2 class="text-xl font-bold text-surface-900 dark:text-white mb-6 flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-secondary-100 dark:bg-secondary-900/50 flex items-center justify-center text-sm font-bold text-secondary-600 dark:text-secondary-400">2</div>
              Trigger (If This)
            </h2>
            
            <!-- Step 1: Select Service -->
            <div v-if="!areaConfig.action.service">
              <p class="text-surface-500 mb-4">Select the service that starts the automation</p>
              <ServiceSelector 
                type="action"
                :services="services"
                :is-loading="isLoadingServices"
                @select="selectActionService" 
              />
            </div>

            <!-- Step 2: Select Trigger & Configure -->
            <div v-else class="animate-slide-up">
               <!-- Selected Service Header -->
               <div class="flex items-center justify-between mb-6 bg-surface-50 dark:bg-surface-800/50 p-4 rounded-xl border border-surface-100 dark:border-surface-700">
                 <div class="flex items-center gap-4">
                    <div class="w-12 h-12 bg-white dark:bg-surface-800 rounded-xl shadow-sm flex items-center justify-center">
                      <span class="text-xl font-bold text-secondary-600">{{ areaConfig.action.service.display_name.charAt(0) }}</span>
                    </div>
                    <div>
                      <h3 class="font-bold text-surface-900 dark:text-white">{{ areaConfig.action.service.display_name }}</h3>
                      <div class="flex items-center gap-2 text-xs text-secondary-600 dark:text-secondary-400">
                        <span class="w-2 h-2 bg-secondary-500 rounded-full"></span>
                        Selected Service
                      </div>
                    </div>
                 </div>
                 <button 
                  @click="resetAction"
                  class="text-sm text-surface-500 hover:text-surface-900 dark:text-surface-400 dark:hover:text-white hover:underline"
                 >Change</button>
               </div>

               <!-- Choose Trigger -->
               <div v-if="!areaConfig.action.trigger">
                  <h3 class="text-lg font-semibold text-surface-800 dark:text-white mb-4">Choose a trigger</h3>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button 
                      v-for="trigger in areaConfig.action.service.actions" 
                      :key="trigger.id"
                      @click="selectActionTrigger(trigger)"
                      class="text-left p-4 border border-surface-200 dark:border-surface-700 rounded-xl hover:border-secondary-500 hover:ring-1 hover:ring-secondary-500 hover:bg-secondary-50/30 dark:hover:bg-secondary-900/30 transition-all group bg-white dark:bg-surface-800"
                    >
                      <div class="font-semibold text-surface-900 dark:text-white group-hover:text-secondary-700 dark:group-hover:text-secondary-400">{{ trigger.name }}</div>
                      <div class="text-sm text-surface-500 mt-1 line-clamp-2">{{ trigger.description }}</div>
                    </button>
                  </div>
               </div>

               <!-- Configure Trigger -->
               <div v-else>
                 <div class="flex items-center gap-2 mb-4">
                   <button @click="areaConfig.action.trigger = null" class="text-sm text-surface-500 hover:text-surface-900 flex items-center gap-1">
                     <ArrowRight :size="14" class="rotate-180" /> Back to triggers
                   </button>
                 </div>
                 <h3 class="text-lg font-bold text-surface-900 dark:text-white mb-2">{{ areaConfig.action.trigger.name }}</h3>
                 <p class="text-surface-500 mb-6 text-sm">{{ areaConfig.action.trigger.description }}</p>
                 <ConfigForm 
                    :config-schema="areaConfig.action.trigger.config_schema || {}"
                    v-model="areaConfig.action.config"
                  />
               </div>
            </div>
          </div>

          <!-- 3. Reactions (Then That) -->
          <div class="space-y-6">
            <div 
              v-for="(reactionItem, index) in areaConfig.reactions" 
              :key="index"
              class="card-area p-8 border-l-4 border-l-primary-500 animate-slide-up"
            >
              <div class="flex items-center justify-between mb-6">
                <h2 class="text-xl font-bold text-surface-900 dark:text-white flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center text-sm font-bold text-primary-600 dark:text-primary-400">{{ 3 + index }}</div>
                  Reaction #{{ index + 1 }} (Then That)
                </h2>
                <button 
                  v-if="areaConfig.reactions.length > 1"
                  @click="removeReaction(index)"
                  class="text-surface-400 hover:text-red-500 p-2 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                  title="Remove reaction"
                >
                  <Trash2 :size="18" />
                </button>
              </div>

              <!-- Step 1: Select Service -->
              <div v-if="!reactionItem.service">
                <p class="text-surface-500 mb-4">Select the service for this reaction</p>
                <ServiceSelector 
                  type="reaction"
                  :services="services"
                  :is-loading="isLoadingServices"
                  @select="(service) => selectReactionService(index, service)" 
                />
              </div>

              <!-- Step 2: Select Action & Configure -->
              <div v-else class="animate-slide-up">
                  <!-- Selected Service Header -->
                 <div class="flex items-center justify-between mb-6 bg-surface-50 dark:bg-surface-800/50 p-4 rounded-xl border border-surface-100 dark:border-surface-700">
                   <div class="flex items-center gap-4">
                      <div class="w-12 h-12 bg-white dark:bg-surface-800 rounded-xl shadow-sm flex items-center justify-center">
                        <span class="text-xl font-bold text-primary-600">{{ reactionItem.service.display_name.charAt(0) }}</span>
                      </div>
                      <div>
                        <h3 class="font-bold text-surface-900 dark:text-white">{{ reactionItem.service.display_name }}</h3>
                        <div class="flex items-center gap-2 text-xs text-primary-600 dark:text-primary-400">
                          <span class="w-2 h-2 bg-primary-500 rounded-full"></span>
                          Selected Service
                        </div>
                      </div>
                   </div>
                   <button 
                    @click="resetReaction(index)"
                    class="text-sm text-surface-500 hover:text-surface-900 dark:text-surface-400 dark:hover:text-white hover:underline"
                   >Change</button>
                 </div>

                 <!-- Choose Reaction -->
                 <div v-if="!reactionItem.reaction">
                    <h3 class="text-lg font-semibold text-surface-800 dark:text-white mb-4">Choose an action</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <button 
                        v-for="react in reactionItem.service.reactions" 
                        :key="react.id"
                        @click="selectReactionTrigger(index, react)"
                        class="text-left p-4 border border-surface-200 dark:border-surface-700 rounded-xl hover:border-primary-500 hover:ring-1 hover:ring-primary-500 hover:bg-primary-50/30 dark:hover:bg-primary-900/30 transition-all group bg-white dark:bg-surface-800"
                      >
                        <div class="font-semibold text-surface-900 dark:text-white group-hover:text-primary-700 dark:group-hover:text-primary-400">{{ react.name }}</div>
                        <div class="text-sm text-surface-500 mt-1 line-clamp-2">{{ react.description }}</div>
                      </button>
                    </div>
                 </div>

                 <!-- Configure Reaction -->
                 <div v-else>
                   <div class="flex items-center gap-2 mb-4">
                     <button @click="reactionItem.reaction = null" class="text-sm text-surface-500 hover:text-surface-900 flex items-center gap-1">
                       <ArrowRight :size="14" class="rotate-180" /> Back to actions
                     </button>
                   </div>
                   <h3 class="text-lg font-bold text-surface-900 dark:text-white mb-2">{{ reactionItem.reaction.name }}</h3>
                   <p class="text-surface-500 mb-6 text-sm">{{ reactionItem.reaction.description }}</p>

                   <!-- Available Variables Display -->
                   <div v-if="areaConfig.action.trigger && areaConfig.action.trigger.variables && Object.keys(areaConfig.action.trigger.variables).length > 0" 
                        class="mb-6 bg-surface-50 dark:bg-surface-800 rounded-lg p-4 border border-surface-200 dark:border-surface-700">
                     <div class="flex items-center gap-2 mb-3">
                       <HelpCircle :size="14" class="text-surface-400" />
                       <h4 class="text-xs font-bold uppercase tracking-wider text-surface-500">
                         Available Variables
                       </h4>
                     </div>
                     <p class="text-xs text-surface-500 mb-3">
                       You can use these variables in your configuration fields.
                     </p>
                     <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                       <div v-for="(desc, name) in areaConfig.action.trigger.variables" :key="name" 
                            class="flex items-center gap-2 text-sm bg-white dark:bg-surface-900 p-2 rounded border border-surface-100 dark:border-surface-700 group cursor-help transition-colors hover:border-primary-200 dark:hover:border-primary-800">
                         <code class="text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30 px-1.5 py-0.5 rounded font-mono text-xs select-all">
                           {{ '{{ ' + name + ' }' + '}' }}
                         </code>
                         <span class="text-surface-600 dark:text-surface-400 text-xs truncate" :title="desc">{{ desc }}</span>
                       </div>
                     </div>
                   </div>

                   <ConfigForm 
                      :config-schema="reactionItem.reaction.config_schema || {}"
                      v-model="reactionItem.config"
                    />
                 </div>
              </div>
            </div>

            <!-- Add Reaction Btn -->
            <button 
              @click="addReaction"
              class="w-full py-4 border-2 border-dashed border-surface-200 dark:border-surface-700 rounded-xl text-surface-500 hover:text-primary-600 hover:border-primary-300 hover:bg-primary-50/50 dark:hover:bg-primary-900/20 transition-all flex items-center justify-center gap-2 font-semibold"
            >
              <Plus :size="20" />
              Add another reaction
            </button>
          </div>
        </div>
      </div>
    </main>

    <!-- History Modal -->
    <HistoryModal
      :is-open="historyModal.isOpen"
      :area-id="historyModal.areaId"
      :area-name="historyModal.areaName"
      @close="closeHistory"
    />

    <!-- Notifications -->
    <Notification
      v-for="notif in notifications"
      :key="notif.id"
      :type="notif.type"
      :title="notif.title"
      :message="notif.message"
      :area-name="notif.areaName"
      :duration="notif.duration"
      @close="removeNotification(notif.id)"
    />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { 
  Workflow, Plus, Trash2, ArrowRight, CheckCircle, Play, Pause, Edit, History, Search, Moon, Sun,
  Layers, Shield, HelpCircle, User, Settings, LogOut, ChevronDown, Menu, X
} from 'lucide-vue-next';
import { areasAPI } from '@/services/api';
import { useWebSocket } from '@/services/websocket';
import DashboardBackground from '../components/backgrounds/DashboardBackground.vue';

// Components
import ServiceSelector from '../components/ServiceSelector.vue';
import ConfigForm from '../components/ConfigForm.vue';
import HistoryModal from '../components/HistoryModal.vue';
import Notification from '../components/Notification.vue';

const router = useRouter();
const { connect, disconnect, on } = useWebSocket();

// State
const isCreating = ref(false);
const services = ref([]);
const isLoadingServices = ref(true);
const userAreas = ref([]);
const isLoadingAreas = ref(true);
const isSaving = ref(false);
const editingAreaId = ref(null);

// User Menu
const showUserMenu = ref(false);
const isMobileMenuOpen = ref(false);
const userMenuRef = ref(null);
const userEmail = ref(localStorage.getItem('user_email') || 'User');
const userInitials = computed(() => {
  const email = userEmail.value;
  if (email && email.includes('@')) {
    return email.substring(0, 2).toUpperCase();
  }
  return 'U';
});

// Close menu when clicking outside
const handleClickOutside = (event) => {
  if (userMenuRef.value && !userMenuRef.value.contains(event.target)) {
    showUserMenu.value = false;
  }
};

// Filters & Search
const searchQuery = ref('');
const statusFilter = ref('all');

// History Modal
const historyModal = reactive({
  isOpen: false,
  areaId: null,
  areaName: ''
});

// Dark Mode
const isDarkMode = ref(false);

const areaConfig = reactive({
  name: '',
  description: '',
  action: {
    service: null,
    trigger: null,
    config: {}
  },
  reactions: [
    { id: Date.now(), service: null, reaction: null, config: {} }
  ]
});

// Computed
const canSaveArea = computed(() => {
  const hasAction = areaConfig.action.service && areaConfig.action.trigger;
  const hasValidReactions = areaConfig.reactions.some(
    r => r.service && r.reaction
  );
  return hasAction && hasValidReactions && areaConfig.name.trim().length > 0;
});

// Filtered Areas
const filteredAreas = computed(() => {
  let filtered = userAreas.value;

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(area => 
      area.name.toLowerCase().includes(query) ||
      (area.description && area.description.toLowerCase().includes(query))
    );
  }

  // Status filter
  if (statusFilter.value === 'active') {
    filtered = filtered.filter(area => area.is_active);
  } else if (statusFilter.value === 'inactive') {
    filtered = filtered.filter(area => !area.is_active);
  }

  return filtered;
});

// Notifications
const notifications = ref([]);

const showNotification = (type, title, message, areaName = null, duration = 5000) => {
  const id = Date.now();
  notifications.value.push({ id, type, title, message, areaName, duration });
  
  setTimeout(() => {
    removeNotification(id);
  }, duration + 500);
};

const removeNotification = (id) => {
  const index = notifications.value.findIndex(n => n.id === id);
  if (index > -1) {
    notifications.value.splice(index, 1);
  }
};

// Fetch services and areas
onMounted(async () => {
  try {
    const data = await areasAPI.about();
    services.value = data.server.services || [];
    
    // Check if returning from OAuth
    const returnTo = localStorage.getItem('oauth_return_to');
    if (returnTo === 'dashboard_create') {
      isCreating.value = true;
      localStorage.removeItem('oauth_return_to');
    }
  } catch (error) {
    console.error('Failed to load services:', error);
  } finally {
    isLoadingServices.value = false;
  }

  // Load user's areas
  await loadUserAreas();
  
  // Connect to WebSocket for real-time notifications
  connect();
  
  // Subscribe to events
  on('area_executed', (data) => {
    console.log('Area executed:', data);
    showNotification(
      data.status === 'success' ? 'success' : 'error',
      data.status === 'success' ? 'Area Executed Successfully' : 'Area Execution Failed',
      data.message || 'Check history for details',
      data.area_name,
      7000
    );
    // Reload areas to update last_triggered
    loadUserAreas();
  });
  
  on('area_triggered', (data) => {
    console.log('Area triggered:', data);
    showNotification(
      'info',
      'Area Triggered',
      `Action detected and reaction queued`,
      data.area_name,
      5000
    );
  });
  
  on('webhook_received', (data) => {
    console.log('Webhook received:', data);
    showNotification(
      'info',
      'Webhook Received',
      `${data.service} webhook processed`,
      null,
      4000
    );
  });
});

// Cleanup on unmount
onUnmounted(() => {
  disconnect();
});

// Load user areas
const loadUserAreas = async () => {
  isLoadingAreas.value = true;
  try {
    const response = await areasAPI.getUserAreas();
    
    // Handle paginated response
    const areas = response.results || response;
    userAreas.value = areas;
  } catch (error) {
    console.error('Failed to load areas:', error);
    userAreas.value = [];
  } finally {
    isLoadingAreas.value = false;
  }
};

// Actions
const startCreation = () => {
  isCreating.value = true;
  resetForm();
};

const cancelCreation = () => {
  if (confirm('Are you sure you want to cancel? All progress will be lost.')) {
    isCreating.value = false;
    resetForm();
  }
};

const resetView = () => {
  if (isCreating.value) {
    cancelCreation();
  }
};

const resetForm = () => {
  areaConfig.name = '';
  areaConfig.description = '';
  areaConfig.action = { service: null, trigger: null, config: {} };
  areaConfig.reactions = [{ id: Date.now(), service: null, reaction: null, config: {} }];
  editingAreaId.value = null;
};

const logout = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  router.push('/login');
};

// Action Flow
const selectActionService = (service) => {
  areaConfig.action.service = service;
};

const selectActionTrigger = (trigger) => {
  areaConfig.action.trigger = trigger;
};

const resetAction = () => {
  areaConfig.action.service = null;
  areaConfig.action.trigger = null;
  areaConfig.action.config = {};
};

// Reaction Flow
const addReaction = () => {
  areaConfig.reactions.push({ 
    id: Date.now(), 
    service: null, 
    reaction: null, 
    config: {} 
  });
};

const removeReaction = (index) => {
  areaConfig.reactions.splice(index, 1);
};

const selectReactionService = (index, service) => {
  areaConfig.reactions[index].service = service;
};

const selectReactionTrigger = (index, reaction) => {
  areaConfig.reactions[index].reaction = reaction;
};

const resetReaction = (index) => {
  areaConfig.reactions[index].service = null;
  areaConfig.reactions[index].reaction = null;
  areaConfig.reactions[index].config = {};
};

// Save Area
const saveArea = async () => {
  if (!canSaveArea.value) return;

  isSaving.value = true;
  try {
    // Get first valid reaction
    const firstReaction = areaConfig.reactions.find(r => r.service && r.reaction);
    
    if (!firstReaction) {
      alert('Please configure at least one reaction');
      return;
    }

    // Check if IDs are present
    if (!areaConfig.action.trigger?.id || !firstReaction.reaction?.id) {
      alert('Action or Reaction ID missing. Please reload and try again.');
      return;
    }

    // Format according to backend API with numeric IDs
    const areaData = {
      name: areaConfig.name.trim(),
      description: areaConfig.description.trim() || undefined,
      action_id: areaConfig.action.trigger.id,          // Numeric ID of Action
      reaction_id: firstReaction.reaction.id,           // Numeric ID of Reaction
      action_config: areaConfig.action.config || {},
      reaction_config: firstReaction.config || {}
    };

    if (editingAreaId.value) {
      // Update existing area
      await areasAPI.updateArea(editingAreaId.value, areaData);
    } else {
      // Create new area
      await areasAPI.createArea(areaData);
    }

    // Reload areas and reset form
    await loadUserAreas();
    isCreating.value = false;
    resetForm();
  } catch (error) {
    console.error('Failed to save area:', error);
    alert('Failed to save area: ' + (error.message || 'Unknown error'));
  } finally {
    isSaving.value = false;
  }
};

// Toggle area active status
const toggleAreaStatus = async (area) => {
  try {
    await areasAPI.toggleAreaActive(area.id);
    await loadUserAreas();
  } catch (error) {
    console.error('Failed to toggle area status:', error);
    alert('Failed to update area status');
  }
};

// Edit area
const editArea = async (area) => {
  try {
    // Load full area details from backend
    const fullArea = await areasAPI.getArea(area.id);
    console.log('Loaded area for editing:', fullArea);
    
    editingAreaId.value = fullArea.id;
    areaConfig.name = fullArea.name;
    areaConfig.description = fullArea.description || '';
    
    // Extract action service ID and action ID
    const actionServiceId = fullArea.action?.service;
    const actionId = fullArea.action?.id;
    
    console.log('Looking for action service:', actionServiceId, 'action:', actionId);
    
    // Find and populate action service
    const actionService = services.value.find(s => s.id === actionServiceId);
    if (actionService) {
      areaConfig.action.service = actionService;
      const actionTrigger = actionService.actions?.find(a => a.id === actionId);
      if (actionTrigger) {
        areaConfig.action.trigger = actionTrigger;
        areaConfig.action.config = fullArea.action_config || {};
        console.log('Action loaded:', actionTrigger.name);
      } else {
        console.error('Action trigger not found:', actionId, 'in service:', actionService.name);
      }
    } else {
      console.error('Action service not found:', actionServiceId);
    }

    // Extract reaction service ID and reaction ID
    const reactionServiceId = fullArea.reaction?.service;
    const reactionId = fullArea.reaction?.id;
    
    console.log('Looking for reaction service:', reactionServiceId, 'reaction:', reactionId);

    // Find and populate reaction service
    const reactionService = services.value.find(s => s.id === reactionServiceId);
    if (reactionService) {
      const reactionTrigger = reactionService.reactions?.find(r => r.id === reactionId);
      if (reactionTrigger) {
        areaConfig.reactions = [{
          id: Date.now(),
          service: reactionService,
          reaction: reactionTrigger,
          config: fullArea.reaction_config || {}
        }];
        console.log('Reaction loaded:', reactionTrigger.name);
      } else {
        console.error('Reaction not found:', reactionId, 'in service:', reactionService.name);
      }
    } else {
      console.error('Reaction service not found:', reactionServiceId);
    }

    console.log('Final areaConfig:', areaConfig);
    isCreating.value = true;
  } catch (error) {
    console.error('Failed to load area details:', error);
    alert('Failed to load area details. Please try again.');
  }
};

// Delete area
const confirmDeleteArea = async (area) => {
  if (!confirm(`Are you sure you want to delete "${area.name}"?`)) return;

  try {
    // Clear the list first to show loading state
    isLoadingAreas.value = true;
    
    // Delete the area
    await areasAPI.deleteArea(area.id);
    
    // Reload the list
    await loadUserAreas();
    
    // Show success message
    console.log('Area deleted successfully');
  } catch (error) {
    console.error('Failed to delete area:', error);
    alert('Failed to delete area: ' + (error.message || 'Unknown error'));
  } finally {
    isLoadingAreas.value = false;
  }
};

// History Modal Functions
const openHistory = (area) => {
  historyModal.areaId = area.id;
  historyModal.areaName = area.name;
  historyModal.isOpen = true;
};

const closeHistory = () => {
  historyModal.isOpen = false;
  historyModal.areaId = null;
  historyModal.areaName = '';
};

// Filter Functions
const clearFilters = () => {
  searchQuery.value = '';
  statusFilter.value = 'all';
};

// Dark Mode
const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value;
  if (isDarkMode.value) {
    document.documentElement.classList.add('dark');
    localStorage.setItem('darkMode', 'true');
  } else {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('darkMode', 'false');
  }
};

// Init dark mode from localStorage
onMounted(() => {
  const savedDarkMode = localStorage.getItem('darkMode');
  if (savedDarkMode === 'true') {
    isDarkMode.value = true;
    document.documentElement.classList.add('dark');
  }
  
  // Add click outside listener
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});

// Helper functions
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

</script>

<style scoped>
.w-18 {
  width: 4.5rem;
}
.h-18 {
  height: 4.5rem;
}

/* Navigation Link Style */
.nav-link {
  @apply flex items-center px-4 py-2 text-sm font-medium text-surface-600 hover:text-primary-600 
         rounded-lg hover:bg-primary-50 dark:text-surface-400 dark:hover:text-primary-400 
         dark:hover:bg-primary-900/30 transition-all;
}

/* Dropdown Item Style */
.dropdown-item {
  @apply flex items-center gap-3 px-4 py-2.5 text-sm text-surface-700 dark:text-surface-300
         hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors cursor-pointer;
}

@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slide-up {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fade-in 0.5s ease-out forwards;
}

.animate-slide-up {
  animation: slide-up 0.4s ease-out forwards;
}
</style>
