

export const sendMessage = (newMessage , activeFriend , user , socketRef) => {
   if (!newMessage.trim()) return;

   const timestamp = new Date().toISOString();

   socketRef.current?.emit("sendMessage", {
     username: user.username,
     userId : user._id,
     targetUserId: activeFriend._id,
     text: newMessage,
     timestamp,
   });
 };