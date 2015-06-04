module Gipsy
  class AppError < StandardError
    attr_reader :status

    def initialize(status = 500)
      @status = status
    end
  end
end