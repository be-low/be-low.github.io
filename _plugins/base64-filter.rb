module Jekyll
    module Base64Filter
        require "base64"
        def encode64(inp) Base64.encode64(inp) end
        def decode64(inp) Base64.decode64(inp) end
    end
end

Liquid::Template.register_filter(Jekyll::Base64Filter)