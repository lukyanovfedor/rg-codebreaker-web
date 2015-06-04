require "json"
require "erb"

module Gipsy
  class Response
    def initialize (headers = {})
      @status = 200
      @headers = headers
      @cookie = []
    end

    def status (status)
      @status = status

      self
    end

    def set_cookie (name, value)
      @cookie << [name, value]
    end

    def render (template, data = {})
      view = File.read(Dir.pwd + "/views/#{template}")

      if data.keys.empty?
        view = ERB.new(view).result
      else
        vars = get_binding(data)
        view = ERB.new(view).result(vars)
      end

      @headers["Content-Type"] = "text/html; charset=utf-8" unless @headers["Content-Type"]

      unleash(view)
    end

    def send (data)
      if data.is_a?(Hash) || data.is_a?(Array)
        data = JSON.generate(data)

        @headers["Content-Type"] = "application/json; charset=utf-8" unless @headers["Content-Type"]
      end

      unleash(data)
    end

    private
      def get_binding (data)
        structure = Struct.new(*data.keys) do
          def b
            binding
          end
        end

        structure.new(*data.values).b
      end

      def unleash (data)
        Rack::Response.new(data, @status, @headers) do |res|
          @cookie.each do |c|
            if c[1].empty?
              res.delete_cookie(c[0])
            else
              res.set_cookie(*c)
            end
          end
        end
      end
  end
end