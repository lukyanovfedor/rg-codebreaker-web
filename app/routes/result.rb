app = Gipsy::Application::Codebreaker

app.router.get "/result" do |req, res|
  res.send(Codebreaker::Game.load_result)
end

app.router.post "/result" do |req, res|
  name = req.params["name"]
  game = req.session[:game]

  if game.is_a? Codebreaker::Game
    game.save_result name
  else
    res.status(400)
  end

  res.send()
end