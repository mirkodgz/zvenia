/**
 * Utility to wrap email content with a consistent Header and Footer
 */

interface EmailLayoutOptions {
    title?: string;
    previewText?: string;
}

export function wrapEmailLayout(content: string, options: EmailLayoutOptions = {}) {
    const {
        title = "ZVENIA - Only Expert Knowledge",
        previewText = "News and updates from ZVENIA"
    } = options;

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>${title}</title>
    <style>
        /* Reset styles */
        body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
        img { -ms-interpolation-mode: bicubic; }

        /* Basic styles */
        body {
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            background-color: #f4f4f4;
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            color: #202124;
            line-height: 1.6;
        }

        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
        }

        .header {
            padding: 40px 20px;
            text-align: center;
            background-color: #0d241b; /* Dark Green */
        }

        .content {
            padding: 40px 30px;
        }

        .footer {
            padding: 30px 20px;
            text-align: center;
            background-color: #f8f9fa;
            border-top: 1px solid #eeeeee;
        }

        .logo-text {
            color: #ffffff;
            font-size: 28px;
            font-weight: bold;
            letter-spacing: 2px;
            margin: 0;
            text-transform: uppercase;
        }

        .tagline {
            color: #00c44b; /* Malachite Green */
            font-size: 14px;
            font-weight: 600;
            margin-top: 5px;
            letter-spacing: 1px;
        }

        .footer-text {
            font-size: 12px;
            color: #666666;
            margin: 5px 0;
        }

        .footer-links a {
            color: #00c44b;
            text-decoration: none;
            margin: 0 10px;
        }

        /* Responsive */
        @media screen and (max-width: 600px) {
            .content {
                padding: 30px 20px !important;
            }
        }
    </style>
</head>
<body>
    <!-- Hidden Preview Text -->
    <div style="display: none; max-height: 0px; overflow: hidden;">
        ${previewText}
    </div>

    <div class="email-container">
        <!-- HEADER -->
        <div class="header">
            <h1 class="logo-text">ZVENIA</h1>
            <div class="tagline">SOLO CONOCIMIENTO EXPERTO</div>
        </div>

        <!-- MAIN CONTENT -->
        <div class="content">
            ${content}
        </div>

        <!-- FOOTER -->
        <div class="footer">
            <p class="footer-text"><strong>ZVENIA © 2026</strong></p>
            <p class="footer-text">La comunidad exclusiva para profesionales de la minería.</p>
            <div class="footer-links" style="margin-top: 15px;">
                <a href="https://zvenia.com">Sitio Web</a>
                <a href="https://zvenia.com/privacy">Privacidad</a>
                <a href="mailto:contact@zvenia.com">Contacto</a>
            </div>
            <p class="footer-text" style="margin-top: 20px; font-size: 11px; color: #999999;">
                Este es un mensaje automático. Por favor, no respondas directamente a este correo.
            </p>
        </div>
    </div>
</body>
</html>
    `.trim();
}
