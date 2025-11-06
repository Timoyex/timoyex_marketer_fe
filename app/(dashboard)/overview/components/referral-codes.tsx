import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { copyToClipboard } from "@/lib/utils";
import { Copy, Link, Share2 } from "lucide-react";

const ReferralCodes = ({
  referralCodes,
  isLoading,
}: {
  referralCodes: { marketer: string; shopper: string };
  isLoading: boolean;
}) => {
  const url = typeof window !== "undefined" ? window.location.hostname : "";
  return (
    <Card className="bg-card border-border shadow-sm hover:scale-105 transition-transform duration-200">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-card-foreground text-sm sm:text-base">
          <div className="p-1.5 bg-green-100 rounded-lg">
            <Link className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
          </div>
          Referral Links/Codes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pb-4">
        {/* Marketer Referral Code/Link */}
        <div className="grid sm:grid-cols-2 gap-6">
          {/* Code */}
          <div className="space-y-1">
            <h4 className="text-xs sm:text-sm font-medium text-card-foreground">
              Marketer Referral Code
            </h4>
            <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
              <Copy className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
              <span className="text-xs sm:text-sm text-muted-foreground font-mono truncate">
                {referralCodes.marketer}
              </span>
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="flex-1 bg-transparent text-xs sm:text-sm h-8 sm:h-9"
                onClick={() => copyToClipboard(referralCodes.marketer)}
                title="Copy Referral Code"
              >
                <Copy
                  className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2"
                  aria-disabled={isLoading}
                />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="flex-1 bg-transparent text-xs sm:text-sm h-8 sm:h-9"
                onClick={() =>
                  navigator.share?.({ text: referralCodes.marketer }) ??
                  copyToClipboard(referralCodes.marketer)
                }
                title="Share Referral Code"
              >
                <Share2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              </Button>
            </div>
          </div>

          {/* Link */}
          <div className="space-y-1">
            <h4 className="text-xs sm:text-sm font-medium text-card-foreground">
              Marketer Referral Link
            </h4>
            <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
              <Copy className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
              <span className="text-xs sm:text-sm text-muted-foreground font-mono truncate">
                {`${url}/join/${referralCodes.marketer}`}
              </span>
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="flex-1 bg-transparent text-xs sm:text-sm h-8 sm:h-9"
                onClick={() =>
                  copyToClipboard(`${url}/join/${referralCodes.marketer}`)
                }
              >
                <Copy className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="flex-1 bg-transparent text-xs sm:text-sm h-8 sm:h-9"
                onClick={() =>
                  navigator.share?.({
                    text: `${url}/join/${referralCodes.marketer}`,
                  }) ?? copyToClipboard(`${url}/join/${referralCodes.marketer}`)
                }
              >
                <Share2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              </Button>
            </div>
          </div>
        </div>

        {/* Shopper Referral Code */}
        <div className="space-y-1">
          <h4 className="text-xs sm:text-sm font-medium text-card-foreground">
            Shopper Referral Code
          </h4>
          <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
            <Copy className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
            <span className="text-xs sm:text-sm text-muted-foreground font-mono truncate">
              {referralCodes.shopper}
            </span>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="flex-1 bg-transparent text-xs sm:text-sm h-8 sm:h-9"
              onClick={() => copyToClipboard(referralCodes.shopper)}
              title="Copy Referral Code"
            >
              <Copy className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="flex-1 bg-transparent text-xs sm:text-sm h-8 sm:h-9"
              title="Share Referral Code"
              onClick={() =>
                navigator.share?.({
                  text: referralCodes.shopper,
                }) ?? copyToClipboard(referralCodes.shopper)
              }
            >
              <Share2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReferralCodes;
