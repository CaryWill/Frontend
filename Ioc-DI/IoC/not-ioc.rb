# > ruby ./not-ioc.rb
puts 'What is your name?'
name = gets
process_name(name)
puts 'What is your quest?'
quest = gets
process_quest(quest)

# from https://martinfowler.com/bliki/InversionOfControl.html

# IOC 的场景在前端还挺常见的，比如 event loop
# 感觉异步编程很多就会涉及 IOC 啊