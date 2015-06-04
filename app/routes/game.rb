app = Gipsy::Application::Codebreaker

app.router.use "/game" do |req, res, next_route|
  if req.params["fresh"]
    req[:game] = Codebreaker::Game.new
  else
    req[:game] = req.session[:game].is_a?(Codebreaker::Game) ? req.session[:game] : Codebreaker::Game.new
  end

  next_route.call
end

app.router.get "/game/gues/:attempt" do |req, res, next_route|
  attempt = req[:route_params][:attempt]
  game = req[:game]

  unless attempt[/^[1-6]{4}$/]
    return res.status(400).send({
      error: "Validation error."
    })
  end

  req[:game_out] = game.gues(attempt)

  next_route.call
end

app.router.get "/game/hint" do |req, res, next_route|
  req[:game_out] = req[:game].hint

  next_route.call
end

app.router.use "/game" do |req, res|
  game = req[:game]

  out = {
    result: req[:game_out],
    attempts: game.attempts_number,
    hints: game.hints_number
  }

  req.session[:game] = game

  res.send(out)
end