app = Gipsy::Application::Codebreaker

app.router.get "/" do |req, res|
  res.render("index.erb")
end
