# Authentication

    - /login
    - /register
    - /logout

# Post

    - post/addNewPost
    - post/deletePost/:post_id
    - post/updatePost/:post_id
    - post/ -> User post and Following post

# ConnectionRequest

    POST - connection/request/:receiverId
    POST - connection/request/accept/:connectionId
    DELETE - connection/:conectionId

# Post Reactions

    POST - post-reaction/like/:postId
    POST - post-reaction/comment/:postId
    DELETE - post-reaction/comment/:commentId
    POST - post-reaction/bookmark/:postId



    - if public account , automaticaly turn the request into accepted and add this status to the receiver collection followers and sender collection following.
    - if private by default pending status will be replaced
