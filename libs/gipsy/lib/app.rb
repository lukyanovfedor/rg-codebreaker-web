module Gipsy
  class Application
    def self.new (name, router = nil)
      raise TypeError, "name must be a String" unless name.is_a? String
      raise NameError, "name needs to start with uppercase" unless name =~ /^[A-Z]/

      app = Class.new do
        @@router = router.is_a?(Router) ? router : Router.new

        def self.router
          @@router
        end

        def self.call (env)
          new(env).find_routes.run_routes
        end

        def initialize (env)
          @env = env
          @request = Rack::Request.new(env)
          @routes = []
          @route_indx = 0

          @next_route = Proc.new do
            run_routes
          end

          @error_handler = Proc.new do |err, res|
            res.status(err.status).render("error.erb", {error: err})
          end
        end

        def find_routes
          method = @request.request_method.downcase.to_sym
          path = @request.path

          found = @@router.find_routes(method, path)

          @routes.concat(found[:routes])
          @request[:route_params] = found[:route_params]

          self
        end

        def run_routes
          route = @routes[@route_indx]

          @route_indx += 1

          begin
            unless route
              raise AppError.new(404), "#{@request.request_method} #{@request.path} not found"
            end

            route[:fn].call(@request, Response.new, @next_route)
          rescue AppError => exc
            @error_handler.call(exc, Response.new)
          end
        end
      end

      self.const_set(name, app)
      app
    end
  end
end