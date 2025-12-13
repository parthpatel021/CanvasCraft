
export class IndexedDB {
    dbName: string;
    version: number;
    db: IDBDatabase | null = null;
    storeNames: string[] = [];

    constructor(dbName: string, version: number, stores: { name: string, options?: IDBObjectStoreParameters }[], afterCreateCallback?: () => void) {
        this.dbName = dbName;
        this.version = version;

        const dbOpenRequest = window.indexedDB.open(dbName, version);

        dbOpenRequest.onerror = () => {
            console.error("IndexedDB error:", dbName, version, dbOpenRequest.error);
        }

        dbOpenRequest.onsuccess = () => {
            this.storeNames = stores.map(store => store.name);

            console.log("IndexedDB opened successfully:", dbName, version);
            this.db = dbOpenRequest.result;
            afterCreateCallback?.();
        }
        dbOpenRequest.onupgradeneeded = (event: any) => {
            const db = event.target.result;
            // FIX object stroe creation - not working
            this.createObjectStore(stores);
        };

    }

    getDB(): Promise<IDBDatabase> {
        return new Promise((resolve, reject) => {
            if (this.db) {
                resolve(this.db);
            } else {
                const dbOpenRequest = window.indexedDB.open(this.dbName, this.version);
                dbOpenRequest.onerror = () => {
                    reject(dbOpenRequest.error);
                }
                dbOpenRequest.onsuccess = () => {
                    this.db = dbOpenRequest.result;
                    resolve(this.db);
                }
            }
        });
    }

    closeDB() {
        if (this.db) {
            this.db.close();
            this.db = null;
            console.log("IndexedDB closed:", this.dbName, this.version);
        }
    }

    private createObjectStore(stores: { name: string, options?: IDBObjectStoreParameters }[]): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            if (!this.db) {
                reject("Database is not initialized.");
                return;
            }

            stores.forEach((store) =>
                this.db?.createObjectStore(store.name, store.options)
            );
            resolve(true);
        });
    }

    // CURD Methods
    private createTransaction(storeNames: string[], mode: IDBTransactionMode): Promise<IDBTransaction> {
        return new Promise(async (resolve, reject) => {
            const db = await this.getDB();
            const transaction = db.transaction(storeNames, mode);
            transaction.oncomplete = () => {
                resolve(transaction);
            }
            transaction.onerror = () => {
                reject(transaction.error);
            }
        });
    };

    private async operationPromise(storeName: string, dataList: any[], operation: "put" | "delete"): Promise<PromiseSettledResult<any>[]> {
        const transaction = await this.createTransaction([storeName], "readwrite");
        const objectStore = transaction.objectStore(storeName);

        const promises = dataList.map((data: any) => {
            return new Promise<any>((resolve, reject) => {
                const request = objectStore[operation](data as any);
                request.onsuccess = () => {
                    // request.result can be undefined, so cast to any to satisfy the resolver type
                    resolve(request.result as any);
                }
                request.onerror = () => {
                    console.error("IndexedDB operation error:", request.error);
                    reject(request.error);
                }
            });
        });
        return Promise.allSettled(promises);
    }

    // This will use for both create and update
    async create(storeName: string, dataList: any[]) {
        if (!dataList.length) {
            return;
        }
        return this.operationPromise(storeName, dataList, "put");
    }

    async delete(storeName: string, uuidList: any[]) {
        if (!uuidList.length) {
            return;
        }
        return this.operationPromise(storeName, uuidList, "delete");
    }

    async readAll() {
        const transaction = await this.createTransaction(this.storeNames, "readonly");

        const promises = this.storeNames.map(storeName => {
            return new Promise<object>((resolve, reject) => {
                const objectStore = transaction.objectStore(storeName);
                const request = objectStore.getAll();
                request.onsuccess = () => {
                    resolve({ [storeName]: request.result });
                }
                request.onerror = () => {
                    reject(request.error);
                }
            });
        });

        const promiseResults = await Promise.allSettled(promises);

        return promiseResults.reduce((acc, result) => {
            if (result.status === "fulfilled") {
                acc = { ...acc, ...result.value };
            }
            return acc;
        }, {});
    }
}
