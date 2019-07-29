module.exports= {
    app: {
        ports:{
            socket: 3001,
            files: process.env.PORT || 3000,
        },
        hook_url:"http://vippanel.cf/telegram/callback.php"
    },
    game: {
        globalRounds: 3
    }
};
