import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();
const db = admin.firestore();

export const getPostList = functions.https.onCall(async data => {
    try {
        const snapshot: any = await db.collection('post').get()
        const result: any = []
        snapshot.forEach((doc: any) => {
            result.push({ ...doc.data(), id: doc.id });
        });

        return {
            post: result
        }
    } catch (error) {
        throw new functions.https.HttpsError('failed-precondition', error);
    }
})

export const getComment = functions.https.onCall(async id => {
    try {
        const snapshot: any = await db.collection('post').doc(id).get()
        return snapshot.data().comment

    } catch (error) {
        throw new functions.https.HttpsError('failed-precondition', error);
    }
})

export const deletePost = functions.https.onCall(async id => {
    try {
        const deleteDoc: any = await db.collection('post').doc(id).delete()
        console.log(deleteDoc);
        return true;
    } catch (error) {
        throw new functions.https.HttpsError('failed-precondition', error);
    }
})

export const writePost = functions.https.onCall(async data => {
    try {
        const ref: any = await db.collection('post').add({ ...data, likeCount: 0 });
        return ref.id
    } catch (error) {
        throw new functions.https.HttpsError('failed-precondition', error);
    }
})

export const likePost = functions.https.onCall(async id => {
    try {
        console.log(id);
        const post: any = await db.collection('post').doc(id).get()
        await db.collection('post').doc(id).update({ likeCount: post.data().likeCount + 1 })
        return true
    } catch (error) {
        throw new functions.https.HttpsError('failed-precondition', error);
    }
})

export const commentPost = functions.https.onCall(async data => {
    try {

    } catch (error) {
        throw new functions.https.HttpsError('failed-precondition', error);
    }
})



export const onValueChange = functions.firestore.document('test/hello').onUpdate(async change => {
    const after: any = change.after.data()
    const payload = {
        data: {
            info: String(after.info)
        }
    }
    return admin.messaging().sendToTopic('testUpdate', payload);
})

