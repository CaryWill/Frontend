function s:Add()
  echo 'test'
endfunction
noremap <unique> <script> <Plug>MyPlugin;  <SID>Add
noremap <SID>Add  :echo '123'<CR>
map <Leader>aaa <Plug>MyPlugin;

" --- 学到了一招使用 @" register（macro和register是一个概念吗我好像弄混了)
let i = 1
while i < 5
  echo "count is" i
  let i += 1
endwhile

" variable i above is global, so you can `:ehco i` to display it
" but `:echo b` will show error, since it's local to script
let s:b = 123

" line('.') is line number of current cursor is at
" It's defining a global function, so you can call it with
" :10,15 call Number()
function Number()
  echo line('.') .. getline('.')
endfunction

" rest and spread args
function Show(start, ...) 
  echo "number of rest:" .. a:0
  echo "first arg of rest:" .. a:1
  echo "rest args is:" a:000
endfunction

" use `:function` to list all global functions
" use `:let` to list all global variables

function GetFuncRef(p1, p2)
  let Ref = function('Show')
  echo Ref
  call Ref(a:p1, a:p2)
  let r = call(Ref, [789, 987])
endfunction

" function is defined with capital letter
" since built-in functions are defined with lower-case

let myDict = { '123': '123' }
" We can define a function to myDict dict(call it object if you like) itself
" and `self` keyword is like `this` keyword in javascript
function myDict.translate(line) dict
  echo a:line
  echo self
  echo join(map(split(a:line), 'get(self, v:val, "fallback value")'))
endfunction

if exists('g:loaded_myplugin')
  finish
endif
" It's nice to set a variable to indicate the plulgin is loaded
" naming convension is `loaded_` prefix recommended
let g:loaded_myplugin = 1

" https://neovim.io/doc/user/usr_41.html#41.11
" <Plug> scriptname mapname
" map expr1 expr2
" expr2 可以是一个 funcionRef
" <script> 表示 {rhs} 只能是 local to script 的，以 <SID> 开头
" <Plug> 用 key 敲出来是不会调用 {rhs} 的
" 为了不暴露函数到全局，我们定义 script 的函数
" 这样我们可以在不同的 script 定义同名的函数
" 但是这样我们就又没办法让外面的人调用了
" 所以我们用了 <Plug> 做了一次 mapping，有点像反向代理
" 这样除非你的 scriptname 冲突了 不然就没事
"
" TODO: 但是我的插件里的脚本名和别人插件里的脚本名重复了怎么半

" reassignment syntax is a little bit weird
