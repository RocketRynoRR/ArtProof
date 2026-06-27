const DB_NAME = "jigsaw-artwork-proof-history";
const DB_VERSION = 1;
const STORE_NAME = "proofs";

const openDatabase = () =>
  new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        const store = database.createObjectStore(STORE_NAME, { keyPath: "id" });
        store.createIndex("updatedAt", "updatedAt");
      }
    };
  });

const runRequest = async (mode, operation) => {
  const database = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, mode);
    const store = transaction.objectStore(STORE_NAME);
    const request = operation(store);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    transaction.oncomplete = () => database.close();
    transaction.onerror = () => reject(transaction.error);
  });
};

export async function saveProofHistory(proof) {
  const id = proof.historyId || crypto.randomUUID();
  const groupId = proof.historyGroupId || id;
  const now = new Date().toISOString();
  const savedProof = {
    ...proof,
    historyId: id,
    historyGroupId: groupId
  };
  const entry = {
    id,
    groupId,
    parentId: proof.historyParentId || null,
    clientName: proof.clientName,
    jobNumber: proof.jobNumber,
    revisionNumber: proof.revisionNumber,
    updatedAt: now,
    proof: savedProof
  };

  await runRequest("readwrite", (store) => store.put(entry));
  return entry;
}

export async function listProofHistory() {
  const entries = await runRequest("readonly", (store) => store.getAll());
  return entries.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function deleteProofHistory(id) {
  await runRequest("readwrite", (store) => store.delete(id));
}
