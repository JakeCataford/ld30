guard :shell do
  watch(/src\/(.*).js/) do |m|
    `./script/compile`
    puts "compiled due to change in #{m}"
  end
end
