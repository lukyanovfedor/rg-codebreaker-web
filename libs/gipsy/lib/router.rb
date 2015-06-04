module Gipsy
  class Router
    def initialize
      @routes = []
      @methods = []

      Rack::MethodOverride::HTTP_METHODS.each do |m|
        @methods << m.downcase.to_sym
      end

      @methods.push(:use)

      @error_handler = Proc.new do |err, res|
        status = err[:status] || 500
        exc = err[:exc]

        res.status(status).render("error.erb", {error: exc})
      end
    end

    def method_missing (method, *args, &block)
      if @methods.include? method
        raise TypeError, "path must be a String" unless args[0].is_a? String
        raise ArgumentError, "block missing" unless block_given?

        write_route(method, *args, &block)
      else
        super
      end
    end

    def find_routes (method, path)
      raise TypeError, "method must be a Symbol" unless method.is_a? Symbol
      raise TypeError, "path must be a String" unless path.is_a? String

      out = {
        routes: [],
        route_params: {}
      }

      mathched_routes = []
      params = {}

      @routes.each do |r|
        if r[:method] != :use && r[:method] != method
          next
        end

        matches = path.scan(r[:pattern]).flatten

        unless matches.empty?
          out[:routes] << r

          r[:params].each_with_index { |p, i| out[:route_params][p.to_sym] = matches[i] }
        end
      end

      out
    end

    private
      def write_route (method, path, &block)
        if method == :use
          pattern = Regexp.new("^" + path.gsub(/:[^\/|$]+/, '(\w+)'))
        else
          pattern = Regexp.new("^" + path.gsub(/:[^\/|$]+/, '(\w+)') + "$")
        end

        @routes << {
          fn: block,
          pattern: pattern,
          params: path.scan(/:([^\/|$]+)/).flatten,
          method: method
        }
      end
  end
end