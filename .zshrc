# PATH
export PATH="$PATH:$HOME/.rvm/bin"
export PATH=$PATH:/usr/local/opt/go/libexec/bin
export PATH="/usr/local/opt/coreutils/libexec/gnubin:$PATH"
export PATH="$HOME/.cargo/bin:$PATH"
export PATH="/usr/local/opt/openssl/bin:$PATH"
export PATH="/usr/local/opt/qt/bin:$PATH"
export LDFLAGS="-L/usr/local/opt/qt/lib"
export CPPFLAGS="-I/usr/local/opt/qt/include"
export PKG_CONFIG_PATH="/usr/local/opt/qt/lib/pkgconfig"
export PATH="/usr/local/opt/libxml2/bin:$PATH"
export LDFLAGS="-L/usr/local/opt/libxml2/lib"
export CPPFLAGS="-I/usr/local/opt/libxml2/include"
export PKG_CONFIG_PATH="/usr/local/opt/libxml2/lib/pkgconfig"

if [ -d "${HOME}/.asdf" ]
then
    . $HOME/.asdf/asdf.sh
    # append completions to fpath
    fpath=(${ASDF_DIR}/completions $fpath)
    # initialise completions with ZSH's compinit
    autoload -Uz compinit
    compinit
fi

if [ -d "${HOME}/.zgen/" ]
then
    # load zgen
    source "${HOME}/.zgen/zgen.zsh"

    autoload -U promptinit; promptinit
    prompt pure

    # if the init scipt doesn't exist
    if ! zgen saved; then
        echo "Creating a zgen save"

        zgen oh-my-zsh

        # plugins
        zgen load zdharma/fast-syntax-highlighting
        zgen load zsh-users/zsh-history-substring-search
        zgen load zsh-users/zsh-completions src
        zgen load zpm-zsh/ssh
        zgen load zsh-users/zsh-completions
        zgen load felixr/docker-zsh-completion
        zgen load subnixr/minimal
        zgen load zsh-users/zsh-autosuggestions
        zgen load Tarrasch/zsh-command-not-found
        zgen load b4b4r07/emoji-cli
        zgen load andrewferrier/fzf-z
        zgen load wfxr/forgit
        zgen load peterhurford/git-it-on.zsh
        # zgen load zdharma/history-search-multi-word
        zgen load agkozak/zsh-z

        zgen save
    fi

fi

# load nvm
if [ -s "$HOME/.nvm/nvm.sh" ] && [ ! "$(type -t __init_nvm)" = function ]; then
  export NVM_DIR="$HOME/.nvm"
  [ -s "$NVM_DIR/bash_completion" ] && . "$NVM_DIR/bash_completion"
  declare -a __node_commands=('nvm' 'node' 'npm' 'yarn' 'gulp' 'grunt' 'webpack')
  function __init_nvm() {
    for i in "${__node_commands[@]}"; do unalias $i; done
    . "$NVM_DIR"/nvm.sh
    unset __node_commands
    unset -f __init_nvm
  }
  for i in "${__node_commands[@]}"; do alias $i='__init_nvm && '$i; done
fi

d=.dircolors
test -r $d && eval "$(gdircolors $d)"

# FZF

[ -f ~/.fzf.zsh ] && source ~/.fzf.zsh
export FZF_DEFAULT_COMMAND='fd --hidden --follow --exclude .git'
export FZF_CTRL_T_COMMAND="$FZF_DEFAULT_COMMAND"
export FZF_ALT_C_COMMAND="$FZF_DEFAULT_COMMAND --type d"

# Move next only if `homebrew` is installed
if command -v brew >/dev/null 2>&1; then
	# Load rupa's z if installed
	[ -f $(brew --prefix)/etc/profile.d/z.sh ] && source $(brew --prefix)/etc/profile.d/z.sh
fi


# aliases

alias cat=bat
export PATH="/usr/local/opt/openssl@1.1/bin:$PATH"
export PATH="/usr/local/opt/imagemagick@6/bin:$PATH"
export ASDF_DIR=$(brew --prefix asdf)
export PATH="/Users/angeal/Library/Python/3.7/bin:$PATH"

TERM="xterm"
export TERM


function emacs {
    if [[ $# -eq 0 ]]; then
        /usr/local/bin/emacs # "emacs" is function, will cause recursion
        return
    fi
    args=($*)
    for ((i=0; i <= ${#args}; i++)); do
        local a=${args[i]}
        # NOTE: -c for creating new frame
        if [[ ${a:0:1} == '-' && ${a} != '-c' && ${a} != '--' ]]; then
            /usr/local/bin/emacs ${args[*]}
            return
        fi
    done
    /usr/local/opt/util-linux/bin/setsid emacsclient -n -a /usr/local/bin/emacs ${args[*]}
}

export GPG_TTY=$(tty)
eval "$(/opt/homebrew/bin/brew shellenv)"
eval "$(starship init zsh)"
eval "$(ssh-agent -s)"

eval "$(starship init zsh)"
