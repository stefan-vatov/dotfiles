;;; $DOOMDIR/config.el -*- lexical-binding: t; -*-

;; Place your private configuration here! Remember, you do not need to run 'doom
;; sync' after modifying this file!


;; Some functionality uses this to identify you, e.g. GPG configuration, email
;; clients, file templates and snippets.

;; Doom exposes five (optional) variables for controlling fonts in Doom. Here
;; are the three important ones:
;;
;; + `doom-font'
;; + `doom-variable-pitch-font'
;; + `doom-big-font' -- used for `doom-big-font-mode'; use this for
;;   presentations or streaming.
;;
;; They all accept either a font-spec, font string ("Input Mono-12"), or xlfd
;; font string. You generally only need these two:
;; (setq doom-font (font-spec :family "monospace" :size 12 :weight 'semi-light)
;;       doom-variable-pitch-font (font-spec :family "sans" :size 13))

;; There are two ways to load a theme. Both assume the theme is installed and
;; available. You can either set `doom-theme' or manually load a theme with the
;; `load-theme' function. This is the default:
(setq doom-theme 'doom-one)

;; If you use `org' and don't want your org files in the default location below,
;; change `org-directory'. It must be set before org loads!

;; This determines the style of line numbers in effect. If set to `nil', line
;; numbers are disabled. For relative line numbers, set this to `relative'.
(setq display-line-numbers-type t)


;; Here are some additional functions/macros that could help you configure Doom:
;;
;; - `load!' for loading external *.el files relative to this one
;; - `use-package!' for configuring packages
;; - `after!' for running code after a package has loaded
;; - `add-load-path!' for adding directories to the `load-path', relative to
;;   this file. Emacs searches the `load-path' when you load packages with
;;   `require' or `use-package'.
;; - `map!' for binding new keys
;;
;; To get information about any of these functions/macros, move the cursor over
;; the highlighted symbol at press 'K' (non-evil users must press 'C-c c k').
;; This will open documentation for it, including demos of how they are used.
;;
;; You can also try 'gd' (or 'C-c c d') to jump to their definition and see how
;; they are implemented.

(setq
 projectile-project-search-path `("~/code/")
 )

(after! lsp-rust
  (setq lsp-rust-server 'rust-analyzer))

 (evil-define-key 'normal org-mode-map
    (kbd "TAB") 'org-cycle
    ">" 'org-shiftmetaright
    "<" 'org-shiftmetaleft)

  (defun log-date ()
    "Insert string for the current time formatted like '2018-09-10'."
    (interactive)                 ; permit invocation in minibuffer
    (insert (format-time-string "%Y-%m-%d")))

  (defun log-date-tomorrow ()
    "Insert string for the current time formatted like '2018-09-10'."
    (interactive)                 ; permit invocation in minibuffer
    (insert (format-time-string "%Y-%m-%d" (time-add (current-time) (* 24 3600)))))


  ;; Org mode settings
  (setq org-directory "~/Dropbox/org/")
  (setq org-todo-keywords '((sequence "TODO" "PROGRESS" "BLOCKED" "ON HOLD" "CONTINUED" "|" "DONE" "DELEGATED" "CANCELED")))

  (setq org-todo-keyword-faces
        '(("TODO" . "#F1B5FF")
          ("PROGRESS" . "#93EEFF")
          ("BLOCKED" . "#FF6868")
          ("ON HOLD" . "#E2FFfA")
          ("DONE" . "#93EEFF")
          ("DELEGATED" . "#FFF5AA")
          ("CANCELED" . "#B5B5B5")
          ("CONTINUED" . "#C15EFF")

          )

  )

  (defun save-writing-buffers ()
    (interactive)
      (save-some-buffers 'no-confirm (lambda ()
        (cond
          ((and buffer-file-name (equal buffer-file-name abbrev-file-name)))
          ((and buffer-file-name (eq major-mode 'latex-mode)))
          ((and buffer-file-name (eq major-mode 'markdown-mode)))
          ((and buffer-file-name (eq major-mode 'emacs-lisp-mode)))
          ((and buffer-file-name (derived-mode-p 'org-mode)))))))

  (global-set-key [f5] 'save-writing-buffers)

  (run-with-idle-timer 30 t 'org-save-all-org-buffers)

  (editorconfig-mode 1)

  (setq system-uses-terminfo nil)
  (add-hook 'shell-mode-hook
            'ansi-color-for-comint-mode-on)

;  (add-to-list 'warning-suppress-types '(yasnippet backquote-change))

; Don't contaminate clipboard when performing operations in Emacs
(setq select-enable-clipboard nil)
(define-key evil-visual-state-map  (kbd "s-c") (kbd "\"+y"))
(define-key evil-insert-state-map  (kbd "s-v") (kbd "C-r +"))
(define-key evil-ex-completion-map (kbd "s-v") (kbd "C-r +"))
(define-key evil-normal-state-map  (kbd "s-v") (kbd "\"+p"))
(define-key evil-ex-search-keymap  (kbd "s-v") (kbd "C-r +"))

;; Create a buffer-local hook to run elixir-format on save, only when we enable elixir-mode.
(add-hook 'elixir-mode-hook
          (lambda () (add-hook 'before-save-hook 'elixir-format nil t)))

"(setq debug-on-error t)
