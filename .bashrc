[ -f ~/.ssh/id_rsa ] && ssh-add ~/.ssh/id_rsa

# PATH
export PATH="$PATH:$HOME/.rvm/bin"
export PATH=$PATH:/usr/local/opt/go/libexec/bin
export PATH="/usr/local/opt/coreutils/libexec/gnubin:$PATH"
export PATH="$HOME/.cargo/bin:$PATH"
export PATH="/usr/local/opt/openssl/bin:$PATH"
export PATH="/usr/local/opt/qt/bin:$PATH"
export PATH="/usr/local/opt/libxml2/bin:$PATH"
export PATH="/opt/homebrew/bin:/opt/homebrew/sbin:$PATH" # homebrew
export LDFLAGS="-L/usr/local/opt/qt/lib"
export CPPFLAGS="-I/usr/local/opt/qt/include"
export PKG_CONFIG_PATH="/usr/local/opt/qt/lib/pkgconfig"
export LDFLAGS="-L/usr/local/opt/libxml2/lib"
export CPPFLAGS="-I/usr/local/opt/libxml2/include"
export PKG_CONFIG_PATH="/usr/local/opt/libxml2/lib/pkgconfig"

export PATH="$PATH:$HOME/.rvm/bin" # Add RVM to PATH for scripting
export PATH="$PATH:~/.bin"

if [ -d "${HOME}/.asdf" ]
then
  . $HOME/.asdf/asdf.sh

  # asdf completions
  . $HOME/.asdf/completions/asdf.bash
fi

export NVM_DIR="$HOME/.nvm"
if [ -s "$HOME/.nvm/nvm.sh" ] && [ ! "$(type -t __init_nvm)" = function ]; then
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

# FZF

[ -f ~/.fzf.zsh ] && source ~/.fzf.bash
export FZF_DEFAULT_COMMAND='fd --hidden --follow --exclude .git'
export FZF_CTRL_T_COMMAND="$FZF_DEFAULT_COMMAND"
export FZF_ALT_C_COMMAND="$FZF_DEFAULT_COMMAND --type d"

# Move next only if `homebrew` is installed

shopt -s expand_aliases

source ~/.aliases

TERM="xterm"
export TERM

# Set homebre path

if [[ -d "/opt/homebrew/opt" ]]
then
    HOMEBREW_PATH="/opt/homebrew/opt"
else
    HOMEBREW_PATH="/usr/local/opt"
fi

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
    $HOMEBREW_PATH/util-linux/bin/setsid emacsclient -n -a /usr/local/bin/emacs ${args[*]}
}

. "$HOME/.cargo/env"

eval "$(starship init bash)"
