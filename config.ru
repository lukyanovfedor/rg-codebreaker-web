require "./app/main"

# app = Gipsy::Application::Codebreaker

app = Rack::Builder.new do
  use Rack::Session::Cookie,
    :key => 'rack.session',
    :secret => 'c8035eccd02fec8ee9362e0a2c02681b'
  run Gipsy::Application::Codebreaker
end

run app