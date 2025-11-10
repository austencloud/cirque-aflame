export type AppTab = 'editor' | 'preview';

export interface AppState {
	activeTab: AppTab;
	isDirty: boolean;
}
