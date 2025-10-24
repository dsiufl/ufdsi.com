import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Unsubscribe — AIIRIDSI',
  description: 'Unsubscribe from the AIIRIDSI mailing list',
  robots: 'noindex, nofollow', // Prevent indexing of unsubscribe pages
}

export default function UnsubscribePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 text-slate-900 dark:text-slate-100">
      <div className="max-w-2xl w-[90%] p-7">
        <div 
          className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-7 border border-slate-200 dark:border-slate-700"
          role="main" 
          aria-labelledby="title"
        >
          <h1 id="title" className="text-2xl font-semibold mb-2">
            Unsubscribe from <span className="font-bold">AIIRIDSI</span>
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mb-5">
            We're sorry to see you go. Choose one of the options below to unsubscribe from the AIIRIDSI list.
          </p>

          <div className="flex gap-3 flex-wrap mt-5" role="group" aria-label="Unsubscribe options">
            {/* Primary unsubscribe link button */}
            <form action="https://lists.ufl.edu/cgi-bin/wa" method="get" className="m-0">
              {/* keep parameters visible for transparency, uses GET so it acts like a link */}
              <input type="hidden" name="SUBED1" value="AIIRIDSI" />
              <input type="hidden" name="A" value="1" />
              <button 
                type="submit" 
                className="inline-flex items-center gap-2.5 px-4 py-3 rounded-lg border-0 font-semibold cursor-pointer bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                id="unsubscribeBtn"
              >
                Unsubscribe
              </button>
            </form>
          </div>

          <div 
            className="mt-5 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-100 dark:border-blue-800"
            aria-live="polite"
          >
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
              <strong>Can't use the button?</strong>
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
              If the link does not work, compose an email to{' '}
              <code className="bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded text-xs font-mono">
                listserv@lists.ufl.edu
              </code>{' '}
              with the message{' '}
              <code className="bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded text-xs font-mono">
                UNSUBSCRIBE AIIRIDSI
              </code>
              . No subject line is required.
            </p>
            <a 
              className="inline-flex items-center gap-2.5 px-4 py-3 rounded-lg border border-blue-200 dark:border-blue-700 bg-transparent text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
              id="emailBtn" 
              href="mailto:listserv@lists.ufl.edu?body=UNSUBSCRIBE%20AIIRIDSI" 
              role="button"
            >
              Compose email to listserv
            </a>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
              If you still have difficulties, contact{' '}
              <a 
                className="text-blue-600 dark:text-blue-400 hover:underline" 
                href="mailto:dsiufl@gmail.com"
              >
                dsiufl@gmail.com
              </a>{' '}
              for help.
            </p>
          </div>

          <div className="mt-5">
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Privacy: this page only sends the unsubscribe request to the listserv and opens your email client for the fallback option. No tracking or analytics are included.
            </p>
          </div>
        </div>
      </div>

      <script
        dangerouslySetInnerHTML={{
          __html: `
            // Improve UX: confirm before navigating away when unsubscribe clicked
            document.getElementById('unsubscribeBtn').addEventListener('click', function(e){
              // show a simple confirmation — prevents accidental clicks
              var ok = confirm('Are you sure you want to unsubscribe from AIIRIDSI?');
              if(!ok) e.preventDefault();
            });

            // Accessibility: allow Enter key on the fallback link
            document.getElementById('emailBtn').addEventListener('keydown', function(e){
              if(e.key === 'Enter' || e.key === ' '){
                e.preventDefault();
                window.location = this.href;
              }
            });
          `,
        }}
      />
    </div>
  )
}
