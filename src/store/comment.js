import { defineStore } from "pinia";

export const useCommentStore = defineStore("Comment", {
	state: () => {
		return {
			rootId: null,
			parent_id: null,
			name: "",
		};
	},
	actions: {
		setData(rootId, parent_id, name) {
			this.rootId = rootId;
			this.parent_id = parent_id;
			this.name = name;
		},
		clear() {
			(this.rootId = null), (this.parent_id = null), (this.name = "");
		},
	},
});
