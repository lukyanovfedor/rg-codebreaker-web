require "bundler/setup"
require "codebreaker"
require "./libs/gipsy/gipsy"

Gipsy::Application.new "Codebreaker"

require "./app/routes/base"
require "./app/routes/game"
require "./app/routes/result"
