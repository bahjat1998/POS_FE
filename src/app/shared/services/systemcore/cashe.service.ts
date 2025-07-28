import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class CacheService {
    private dbName = 'CacheDB';
    private storeName = 'CacheStore';
    private db: IDBDatabase | null = null;

    constructor() {
        this.initDB();
    }

    /**
     * Initialize IndexedDB and create an object store if it doesn't exist
     */
    public initDB(): void {
        const request = indexedDB.open(this.dbName, 1);

        request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
            const db = (event.target as IDBOpenDBRequest).result;
            if (!db.objectStoreNames.contains(this.storeName)) {
                db.createObjectStore(this.storeName, { keyPath: 'key' });
            }
        };

        request.onsuccess = (event: Event) => {
            this.db = (event.target as IDBOpenDBRequest).result;
        };

        request.onerror = (event: Event) => {
            console.error('IndexedDB initialization error:', (event.target as IDBOpenDBRequest).error);
        };
    }

    /**
     * Get a value from IndexedDB
     */
    async get(key: string): Promise<any> {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                return reject('Database not initialized');
            }

            const transaction = this.db.transaction(this.storeName, 'readonly');
            const store = transaction.objectStore(this.storeName);
            const request = store.get(key);

            request.onsuccess = () => {
                resolve(request.result ? request.result.value : null);
            };

            request.onerror = () => {
                reject('Error retrieving data');
            };
        });
    }

    async hasKey(key: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                return reject('Database not initialized');
            }

            const transaction = this.db.transaction(this.storeName, 'readonly');
            const store = transaction.objectStore(this.storeName);
            const request = store.get(key);

            request.onsuccess = () => {
                // If result exists, resolve true; otherwise, false
                resolve(request.result !== undefined);
            };

            request.onerror = () => {
                reject(false);
            };
        });
    }


    /**
     * Set a value in IndexedDB
     */
    async set(key: string, value: any): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                return reject('Database not initialized');
            }

            const transaction = this.db.transaction(this.storeName, 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const request = store.put({ key, value });

            request.onsuccess = () => resolve();
            request.onerror = () => reject('Error saving data');
        });
    }

    /**
     * Remove a key from IndexedDB
     */
    async remove(key: string): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                return reject('Database not initialized');
            }

            const transaction = this.db.transaction(this.storeName, 'readwrite');
            const store = transaction.objectStore(this.storeName);

            // Open a cursor to iterate through all keys
            const request = store.openCursor();

            request.onsuccess = (event: any) => {
                const cursor = event.target.result;

                if (cursor) {
                    const currentKey = cursor.key;

                    if (typeof currentKey === 'string' && (currentKey.includes(key) || currentKey == key)) {
                        store.delete(currentKey);
                    }

                    cursor.continue();
                } else {
                    resolve();
                }
            };

            request.onerror = () => reject('Error iterating through keys');
        });
    }

    /**
     * Clear all data in IndexedDB
     */
    async clear(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                return reject('Database not initialized');
            }

            const transaction = this.db.transaction(this.storeName, 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const request = store.clear();

            request.onsuccess = () => resolve();
            request.onerror = () => reject('Error clearing data');
        });
    }


    async getItemsBasedFilter(req: any): Promise<any[]> {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                return reject('Database not initialized');
            }

            const result: any[] = []; // To store matching items
            const transaction = this.db.transaction(this.storeName, 'readonly');
            const store = transaction.objectStore(this.storeName);

            // Open cursor to iterate over all items in the store
            const request = store.openCursor();

            request.onsuccess = (event: any) => {
                const cursor = event.target.result;

                if (cursor) {
                    const currentItem = cursor.value;

                    // Check your condition here to filter the data
                    if (currentItem.key === "__AllItems__" && currentItem.value.lstData) {
                        // Filter the data based on your condition
                        let filteredItems: any = [];
                        if (req.GroupId) {
                            filteredItems = currentItem.value.lstData.filter((item: any) => {
                                return item.groupId === req.GroupId; // Modify the condition as needed
                            });
                        }
                        else if (req.strSearch) {
                            filteredItems = currentItem.value.lstData.filter((item: any) => {
                                return item.nameAr.indexOf(req.strSearch) > -1 || item.nameEn.indexOf(req.strSearch) > -1; // Modify the condition as needed
                            });
                        }
                        else if (req.barcode) {
                            let relatedItem = null;
                            let matchedItem = null;
                            if (req.productBarcode) {
                                let lstItemsHasEnableWeights = currentItem.value.lstData.filter((item: any) => item.lstUnits && item.enableWeight);
                                if (lstItemsHasEnableWeights.length > 0) {
                                    let productBarcode = req.barcode.substring(0, 7);
                                    matchedItem = lstItemsHasEnableWeights.find((item: any) => item.lstUnits && item.lstUnits.some((z: any) => z.barcode == productBarcode));
                                    if (matchedItem) {
                                        matchedItem.quantity = req.quantityCode
                                        relatedItem = matchedItem;
                                    }
                                }
                            }
                            if (!matchedItem) {
                                relatedItem = currentItem.value.lstData.find((item: any) => item.lstUnits && item.lstUnits.some((z: any) => z.barcode == req.barcode));
                            }
                            filteredItems = [relatedItem]
                        }
                        // Add the filtered items to the result
                        result.push(...filteredItems);
                    }
                    cursor.continue();
                } else {
                    // When the cursor reaches the end, resolve the result
                    resolve(result);
                }
            };

            request.onerror = () => {
                reject('Error retrieving data using cursor');
            };
        });
    }

    async getItemsBasedSelectedItems(req: any): Promise<any[]> {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                return reject('Database not initialized');
            }

            const result: any[] = []; // To store matching items
            const transaction = this.db.transaction(this.storeName, 'readonly');
            const store = transaction.objectStore(this.storeName);

            // Open cursor to iterate over all items in the store
            const request = store.openCursor();

            request.onsuccess = (event: any) => {
                const cursor = event.target.result;

                if (cursor) {
                    const currentItem = cursor.value;

                    // Check your condition here to filter the data
                    if (currentItem.key === "__AllItems__" && currentItem.value.lstData) {
                        // Filter the data based on your condition
                        let filteredItems: any = {};
                        if (req.lstItemIds) {
                            filteredItems = currentItem.value.lstData.filter((item: any) => {
                                return req.lstItemIds.indexOf((z: any) => item.id == z) > -1; // Modify the condition as needed
                            });
                        }
                        else {
                            currentItem.value.lstData.forEach((item: any) => {
                                if (filteredItems.length <= 50) {
                                    filteredItems.push(item)
                                }
                            });
                        }

                        // Add the filtered items to the result
                        result.push(...filteredItems);
                    }

                    if ((!req.lstItemIds || req.lstItemIds.length == 0) && result.length == 50) {
                        resolve(result);
                    }
                    else {
                        cursor.continue();
                    }
                } else {
                    // When the cursor reaches the end, resolve the result
                    resolve(result);
                }
            };

            request.onerror = () => {
                reject('Error retrieving data using cursor');
            };
        });
    }

}
