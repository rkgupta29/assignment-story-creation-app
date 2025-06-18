import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  DocumentData,
  QueryDocumentSnapshot,
  QueryConstraint,
  writeBatch,
  runTransaction,
  onSnapshot,
  Unsubscribe,
  Transaction,
  WhereFilterOp,
} from "firebase/firestore";
import { db } from "./config";

// Generic type for document data
export type DocumentWithId<T> = T & { id: string };

// Collection reference helper
export const getCollectionRef = (collectionName: string) => {
  return collection(db, collectionName);
};

// Document reference helper
export const getDocumentRef = (collectionName: string, documentId: string) => {
  return doc(db, collectionName, documentId);
};

// Get a single document
export const getDocument = async <T extends DocumentData>(
  collectionName: string,
  documentId: string
): Promise<DocumentWithId<T> | null> => {
  try {
    const docRef = getDocumentRef(collectionName, documentId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as DocumentWithId<T>;
    }
    return null;
  } catch (error) {
    console.error("Error getting document:", error);
    throw error;
  }
};

// Get multiple documents with optional query constraints
export const getDocuments = async <T extends DocumentData>(
  collectionName: string,
  constraints: QueryConstraint[] = []
): Promise<DocumentWithId<T>[]> => {
  try {
    const collectionRef = getCollectionRef(collectionName);
    const q = query(collectionRef, ...constraints);
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as DocumentWithId<T>[];
  } catch (error) {
    console.error("Error getting documents:", error);
    throw error;
  }
};

// Add a new document
export const addDocument = async <T extends DocumentData>(
  collectionName: string,
  data: T
): Promise<string> => {
  try {
    const collectionRef = getCollectionRef(collectionName);
    const docRef = await addDoc(collectionRef, data);
    return docRef.id;
  } catch (error) {
    console.error("Error adding document:", error);
    throw error;
  }
};

// Update a document
export const updateDocument = async <T extends DocumentData>(
  collectionName: string,
  documentId: string,
  data: Partial<T>
): Promise<void> => {
  try {
    const docRef = getDocumentRef(collectionName, documentId);
    await updateDoc(docRef, data as DocumentData);
  } catch (error) {
    console.error("Error updating document:", error);
    throw error;
  }
};

// Delete a document
export const deleteDocument = async (
  collectionName: string,
  documentId: string
): Promise<void> => {
  try {
    const docRef = getDocumentRef(collectionName, documentId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting document:", error);
    throw error;
  }
};

// Real-time listener for a single document
export const subscribeToDocument = <T extends DocumentData>(
  collectionName: string,
  documentId: string,
  callback: (data: DocumentWithId<T> | null) => void
): Unsubscribe => {
  const docRef = getDocumentRef(collectionName, documentId);
  return onSnapshot(docRef, (doc) => {
    if (doc.exists()) {
      callback({ id: doc.id, ...doc.data() } as DocumentWithId<T>);
    } else {
      callback(null);
    }
  });
};

// Real-time listener for multiple documents
export const subscribeToDocuments = <T extends DocumentData>(
  collectionName: string,
  constraints: QueryConstraint[],
  callback: (data: DocumentWithId<T>[]) => void
): Unsubscribe => {
  const collectionRef = getCollectionRef(collectionName);
  const q = query(collectionRef, ...constraints);
  return onSnapshot(q, (querySnapshot) => {
    const documents = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as DocumentWithId<T>[];
    callback(documents);
  });
};

// Batch operations
export const batchWrite = async (
  operations: Array<{
    type: "add" | "update" | "delete";
    collection: string;
    id?: string;
    data?: DocumentData;
  }>
): Promise<void> => {
  try {
    const batch = writeBatch(db);

    operations.forEach(({ type, collection: collectionName, id, data }) => {
      if (type === "add" && data) {
        const docRef = doc(collection(db, collectionName));
        batch.set(docRef, data);
      } else if (type === "update" && id && data) {
        const docRef = getDocumentRef(collectionName, id);
        batch.update(docRef, data);
      } else if (type === "delete" && id) {
        const docRef = getDocumentRef(collectionName, id);
        batch.delete(docRef);
      }
    });

    await batch.commit();
  } catch (error) {
    console.error("Error in batch write:", error);
    throw error;
  }
};

// Transaction operations
export const runFirestoreTransaction = async <T>(
  updateFunction: (transaction: Transaction) => Promise<T>
): Promise<T> => {
  try {
    return await runTransaction(db, updateFunction);
  } catch (error) {
    console.error("Error in transaction:", error);
    throw error;
  }
};

// Query helpers
export const queryHelpers = {
  where: (field: string, operator: WhereFilterOp, value: unknown) =>
    where(field, operator, value),
  orderBy: (field: string, direction?: "asc" | "desc") =>
    orderBy(field, direction),
  limit: (count: number) => limit(count),
  startAfter: (snapshot: QueryDocumentSnapshot) => startAfter(snapshot),
};
