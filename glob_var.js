module.exports= {
    app: {
        ports:{
            socket: 3001,
            files: process.env.PORT || 3000,
        },
        hook_url:"https://sarzamin24.xyz/callback.php"
    },
    game: {
        globalRounds: 3
    }
};
