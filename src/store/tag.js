import { defineStore } from "pinia";

export const useTagStore = defineStore("Tag", {
	state: () => {
		return {
			activatedTags: new Set(),
		};
	},
	actions: {
		toggleTag(TagId) {
			if (this.activatedTags.has(TagId)) {
				this.activatedTags.delete(TagId);
			} else {
				this.activatedTags.add(TagId);
			}
		},
	},
});
