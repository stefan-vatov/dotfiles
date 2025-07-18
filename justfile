stow *args:
  stow -t ~ {{ args }}

stow-all:
  stow -t ~ -R . --ignore='.DS_Store'

link:
  ./scripts/link.sh

unlink:
  ./scripts/unlink.sh
