/**
	A module to store user preferences.
	
	Use:
	
		// Store a value
		userprefs.put(key, value);
		
		// Retrieve the value. Default is optional, and will be returned
		// if key is not known
		var value = userprefs.get(key[, default]);
		
		// Check if a key is known		
		if (userprefs.has(key)) {
			...
		}
		
		// Delete a key (and its value) from storage
		userprefs.delete(key);
		
		
	Where:
		key is a string, idetnifying a value to store.
		
		Keys should be 'namespaced' using '.' to build hiarachies.
		
		e.g.: 'processupdates.tax00001.lastviewed','processupdates.tax00002.lastviewed'
		
				
		value is any kind of javascript value (except 'undefined').
		
		values will be serialized using JSON, so try to keep them fairly simple. 
 */

window.userprefs = (function (){

	function storageAvailable(type) {
		try {
			var storage = window[type],
				x = '__storage_test__';
			storage.setItem(x, x);
			storage.removeItem(x);
			return true;
		}
		catch(e) {
			return false;
		}
	}

	if (!storageAvailable('localStorage')) {
		throw new Error("Can't use local storage for user preferences, and no alternative defined");
	}
	
	var store = window.localStorage;
	
	return {
		put : function(key, value) {
			if (key === undefined || value === undefined) {
				return;
			}
			store.setItem(key, JSON.stringify(value));
		},
		
		get : function(key, def) {
			if (key in store) {
				return JSON.parse(store.getItem(key));
			} else {
				return def;
			}
		},
		
		has : function(key) {
			return (key in store);
		},
		
		delete : function(key) {
			store.removeItem(key);
		}		
	};
})();