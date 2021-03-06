import {
    app,
    passport,
} from '.'

app.get('/auth/github', passport.authenticate('github'))
app.get(
    '/auth/github/callback',
    passport.authenticate('github', { failureRedirect: '/auth/github' }),
    (req, res) => {
        res.redirect('climbinglog://login?user=' + JSON.stringify(req.user))
    }
)

app.get('/auth/google', passport.authenticate('google', { scope: ['profile'] }))
app.get(
    '/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/auth/google' }),
    (req, res) => {
        res.redirect('climbinglog://login?user=' + JSON.stringify(req.user))
    }
)
