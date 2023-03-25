set nocompatible              " be iMproved, required
set backspace=indent,eol,start
filetype off
set visualbell t_vb=
set autoread
set autochdir
set smartcase
" Adds the yank to the clipboard
set clipboard+=unnamedplus

call plug#begin('~/.vim/plugged')
Plug 'sjl/badwolf'
Plug 'gmarik/Vundle.vim'
"Plug 'FelikZ/ctrlp-py-matcher'
Plug 'scrooloose/syntastic'
Plug 'sjl/badwolf'
Plug 'sjl/gundo.vim'
Plug 'rking/ag.vim'
"Plug 'kien/ctrlp.vim'
Plug 'bling/vim-airline'
Plug 'bling/vim-bufferline'
Plug 'tpope/vim-surround'
Plug 'airblade/vim-gitgutter'
"Plug 'godlygeek/tabular'
Plug 'junegunn/vim-easy-align'
Plug 'editorconfig/editorconfig-vim'
Plug 'bronson/vim-trailing-whitespace'
Plug 'Yggdroot/indentLine'
Plug 'scrooloose/nerdtree'
Plug 'scrooloose/nerdcommenter'
" Plug 'Chiel92/vim-autoformat'
" Plug '2072/PHP-Indenting-for-VIm'
Plug 'jelera/vim-javascript-syntax'
Plug 'pangloss/vim-javascript'
" Plug 'Raimondi/delimitMate'
" Plug 'Valloric/YouCompleteMe'
Plug 'marijnh/tern_for_vim'
Plug 'matze/vim-move'
Plug 'jeetsukumaran/vim-buffergator'
Plug 'terryma/vim-expand-region'
Plug 'tpope/vim-fugitive'
" Bundle 'tpope/vim-markdown'
Plug 'cakebaker/scss-syntax.vim'
Plug 'hail2u/vim-css3-syntax'
Plug 'kchmck/vim-coffee-script'
Plug 'tpope/vim-commentary'
Plug 'maksimr/vim-jsbeautify'
Plug 'einars/js-beautify'
Plug 'heavenshell/vim-jsdoc'
Plug 'tpope/vim-eunuch'
Plug 'vim-airline/vim-airline-themes'
Plug 'junegunn/fzf', { 'dir': '~/.fzf', 'do': './install --all' }
Plug 'junegunn/fzf.vim'
call plug#end()            " required
filetype plugin indent on

colorscheme badwolf
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


"Tern
"Enable keyboard shortcuts
let g:tern_map_keys=1
" Automatic hints after delay
" let g:tern_show_argument_hints='on_hold'

" Shortcuts
nnoremap <leader>td :TernDoc<CR>
nnoremap <leader>tb :TernDocBrowse<CR>
nnoremap <leader>tt :TernType<CR>
nnoremap <leader>td :TernDef<CR>
nnoremap <leader>tpd :TernDefPreview<CR>
nnoremap <leader>tsd :TernDefSplit<CR>
nnoremap <leader>tr :TernRefs<CR>
nnoremap <leader>tR :TernRename<CR>

" My keymaps
map <C-n> :NERDTreeToggle<CR>
noremap <F3> :Autoformat<CR><CR>
imap <C-c> <CR><Esc>O
nnoremap Y y$
" Move lines up and down with j/k

" Center screen after junping
nnoremap n nzz
nnoremap } }zz

au FileType javascript call JavaScriptFold()
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

"augroup configgroup
"autocmd!
"autocmd VimEnter * highlight clear SignColumn
"autocmd BufWritePre *.php,*.py,*.js,*.txt,*.hs,*.java,*.md
"\:call <SID>StripTrailingWhitespaces()
"autocmd FileType java setlocal noexpandtab
"autocmd FileType java setlocal list
"autocmd FileType java setlocal listchars=tab:+\ ,eol:-
"autocmd FileType java setlocal formatprg=par\ -w80\ -T4
"autocmd FileType php setlocal expandtab
"autocmd FileType php setlocal list
"autocmd FileType php setlocal listchars=tab:+\ ,eol:-
"autocmd FileType php setlocal formatprg=par\ -w80\ -T4
"autocmd FileType ruby setlocal tabstop=2
"autocmd FileType ruby setlocal shiftwidth=2
"autocmd FileType ruby setlocal softtabstop=2
"autocmd FileType ruby setlocal commentstring=#\ %s
"autocmd FileType python setlocal commentstring=#\ %s
"autocmd BufEnter *.cls setlocal filetype=java
"autocmd BufEnter *.zsh-theme setlocal filetype=zsh
"autocmd BufEnter Makefile setlocal noexpandtab
"autocmd BufEnter *.sh setlocal tabstop=2
"autocmd BufEnter *.sh setlocal shiftwidth=2
"autocmd BufEnter *.sh setlocal softtabstop=2
"augroup END


" Backup stuff
set backup
set backupdir=~/.vim-tmp,~/.tmp,~/tmp,/var/tmp,/tmp
set backupskip=/tmp/*,/private/tmp/*
set directory=~/.vim-tmp,~/.tmp,~/tmp,/var/tmp,/tmp
set writebackup



"function! <SID>StripTrailingWhitespaces()
"" save last search & cursor position
"let _s=@/
"let l = line(".")
"let c = col(".")
"%s/\s\+$//e
"let @/=_s
"call cursor(l, c)
"endfunction



" Airline
let g:airline_powerline_fonts=1
let g:airline_left_sep=''
let g:airline_right_sep=''
let g:airline#extensions#tabline#enabled = 1
let g:airline#extensions#tabline#fnamemod = ':t'
let g:airline_theme='badwolf'
set laststatus=2

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


" Setup some default ignores
"let g:ctrlp_custom_ignore = {
			\ 'dir':  '\v[\/](\.(git|hg|svn)|\_site)$',
			\ 'file': '\v\.(exe|so|dll|class|png|jpg|jpeg)$',
			\}
"
"     " Use the nearest .git directory as the cwd
"     " This makes a lot of sense if you are working on a project that is in
"     version
"     " control. It also supports works with .svn, .hg, .bzr.
"let g:ctrlp_working_path_mode = 'r'
"
"     " Use a leader instead of the actual named binding
nmap <leader>o :CtrlP<cr>
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

" FZF

let g:fzf_action = {
  \ 'ctrl-e': 'tab split',
  \ 'ctrl-x': 'split',
  \ 'ctrl-v': 'vsplit' }

" Default fzf layout
" " - down / up / left / right
let g:fzf_layout = { 'down': '~40%' }

" " In Neovim, you can set up fzf window using a Vim command
let g:fzf_layout = { 'window': 'enew' }
let g:fzf_layout = { 'window': '-tabnew' }

" " Customize fzf colors to match your color scheme
let g:fzf_colors =
 \ { 'fg':      ['fg', 'Normal'],
 \ 'bg':      ['bg', 'Normal'],
 \ 'hl':      ['fg', 'Comment'],
 \ 'fg+':     ['fg', 'CursorLine', 'CursorColumn', 'Normal'],
 \ 'bg+':     ['bg', 'CursorLine', 'CursorColumn'],
 \ 'hl+':     ['fg', 'Statement'],
 \ 'info':    ['fg', 'PreProc'],
 \ 'prompt':  ['fg', 'Conditional'],
 \ 'pointer': ['fg', 'Exception'],
 \ 'marker':  ['fg', 'Keyword'],
 \ 'spinner': ['fg', 'Label'],
 \ 'header':  ['fg', 'Comment'] }

" Enable per-command history.
" CTRL-N and CTRL-P will be automatically bound to
" next-history and
" previous-history instead of down and up. If you
" don't like the change,
" explicitly bind the keys to down and up in your $FZF_DEFAULT_OPTS.
let g:fzf_history_dir = '~/.local/share/fzf-history'
"
set splitbelow
set splitright


set nofoldenable
