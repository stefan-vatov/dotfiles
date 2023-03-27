set nocompatible              " be iMproved, required
set backspace=indent,eol,start
filetype off
set visualbell t_vb=
set autoread
set autochdir
set smartcase
" Adds the yank to the clipboard
set clipboard+=unnamedplus

filetype plugin indent on

syntax enable
set softtabstop=2
set tabstop=2
set shiftwidth=2
set number
set showcmd
set cursorline
filetype indent on
set wildmenu
" set lazyredraw
set showmatch
set linebreak
set noswapfile


" My keymaps
map <C-n> :NERDTreeToggle<CR>
noremap <F3> :Autoformat<CR><CR>
imap <C-c> <CR><Esc>O
nnoremap Y y$
" Move lines up and down with j/k

" Center screen after junping
nnoremap n nzz
nnoremap } }zz

set completeopt-=preview



" Searching

set incsearch
set hlsearch
" turn off search highlight
let mapleader=","       " leader is comma
nnoremap <leader>. :nohlsearch<CR>

" Folding
set foldenable
set foldlevelstart=10
set foldnestmax=10
" space open/closes folds
nnoremap <space> za
set foldmethod=indent

" Change some grep defaults
nnoremap K :grep! "\b<C-R><C-W>\b"<CR>:cw<CR>
set grepprg=ag\ --nogroup\ --nocolor

" bind \ (backward slash) to grep shortcut
command -nargs=+ -complete=file -bar Ag silent! grep! <args>|cwindow|redraw!
nnoremap \ :Ag<SPACE>

" Movement
" move vertically by visual line
nnoremap j gj
nnoremap k gk

" move to beginning/end of line
nnoremap B ^
nnoremap E $

" $/^ doesn't do anything
nnoremap $ <nop>
nnoremap ^ <nop>

" highlight last inserted text
nnoremap gV `[v`]

" Leader Shortcuts
inoremap jk <esc>
" toggle gundo
nnoremap <leader>u :GundoToggle<CR>


" save session
nnoremap <leader>s :mksession<CR>

" Open ag.vim
nnoremap <leader>a :Ag


" CTRLP Settings
"let g:ctrlp_match_func = { 'match': 'pymatcher#PyMatch' }
"let g:ctrlp_match_window = 'bottom,order:ttb'
"let g:ctrlp_switch_buffer = 0
"let g:ctrlp_working_path_mode = 0
"let g:ctrlp_user_command = 'ag %s -l --nocolor --nogroup --hidden --ignore .git --ignore .svn --ignore .hg --ignore .DS_Store -g ""'


" allows cursor change in tmux mode
if exists('$TMUX')
	let &t_SI = "\<Esc>Ptmux;\<Esc>\<Esc>]50;CursorShape=1\x7\<Esc>\\"
	let &t_EI = "\<Esc>Ptmux;\<Esc>\<Esc>]50;CursorShape=0\x7\<Esc>\\"
else
	let &t_SI = "\<Esc>]50;CursorShape=1\x7"
	let &t_EI = "\<Esc>]50;CursorShape=0\x7"
endif

" Backup stuff
set backup
set backupdir=~/.vim-tmp,~/.tmp,~/tmp,/var/tmp,/tmp

" Remove trailing whitespace
autocmd BufWritePre * :%s/\s\+$//e

" Easy Align
" Start interactive EasyAlign in visual mode (e.g. vip<Enter>)
vmap <Enter> <Plug>(EasyAlign)

" Start interactive EasyAlign for a motion/text object (e.g. gaip)
nmap ga <Plug>(EasyAlign)


" Use the right side of the screen
let g:buffergator_viewport_split_policy = 'R'
"
" " I want my own keymappings...
let g:buffergator_suppress_keymaps = 1
"
" " Looper buffers
" "let g:buffergator_mru_cycle_loop = 1
"
" " Go to the previous buffer open
nmap <leader>jj :BuffergatorMruCyclePrev<cr>
"
" " Go to the next buffer open
nmap <leader>kk :BuffergatorMruCycleNext<cr>
"
" " View the entire list of buffers open
nmap <leader>bl :BuffergatorOpen<cr>
"
" " Shared bindings from Solution #1 from earlier
nmap <leader>T :enew<cr>
nmap <leader>bq :bp <BAR> bd #<cr>

"
" Easy bindings for its various modes
nmap <leader>bb :CtrlPBuffer<cr>
nmap <leader>bm :CtrlPMixed<cr>
nmap <leader>bs :CtrlPMRU<cr>


" Angeal's bindings
nnoremap <Leader>w :w<CR>
vmap <Leader>y "+y
vmap <Leader>d "+d
nmap <Leader>p "+p
nmap <Leader>P "+P
vmap <Leader>p "+p
vmap <Leader>P "+P
nmap <Leader><Leader> V


vmap v <Plug>(expand_region_expand)
vmap <C-v> <Plug>(expand_region_shrink)


" vp doesn't replace paste buffer
function! RestoreRegister()
	let @" = s:restore_reg
	return ''
endfunction
function! s:Repl()
	let s:restore_reg = @"
	return "p@=RestoreRegister()\<cr>"
endfunction
vmap <silent> <expr> p <sid>Repl()


" Slits

nnoremap <C-J> <C-W><C-J>
nnoremap <C-K> <C-W><C-K>
nnoremap <C-L> <C-W><C-L>
nnoremap <C-H> <C-W><C-H>

set splitbelow
set splitright


set nofoldenable
