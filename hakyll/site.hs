{-# LANGUAGE OverloadedStrings #-}

import Data.Monoid (mappend)
import Hakyll
import Hakyll.Core.Configuration
import Text.Blaze.Html.Renderer.String (renderHtml)
import Text.Blaze.Html ((!), toHtml, toValue)
import qualified Text.Blaze.Html5 as H

config :: Configuration
config = defaultConfiguration
        { deployCommand = "rsync -avz -e ssh ./_site/ korolr.me:/var/www/korolr.me/" }

feedConfig :: FeedConfiguration
feedConfig = FeedConfiguration
     { feedTitle       = "korolr.me/blog"
     , feedDescription = "My blog "
     , feedAuthorName  = "Alexsey Lebedev"
     , feedAuthorEmail = "cyberfunk9@gmail.com.com"
     , feedRoot        = "http://korolr.me/"
     }

teaserCtx = teaserField "teaser" "content" `mappend` postCtx

postCtxWithTags :: Tags -> Context String
postCtxWithTags tags = tagsField "tags" tags `mappend` postCtx

-- postCtxWithTags :: Tags -> Context String
-- postCtxWithTags tags = renderTagList' "tags" (const $ fromFilePath "error/404") tags `mappend` postCtx



-- | Render tags as HTML list with links
renderTagList' :: String
               -- ^ Destination key
               -> (String -> Identifier)
               -- ^ Produce a link for a tag
               -> Context String
renderTagList' destination makeUrl =
    field destination $ \item -> renderTags <$> getTags (itemIdentifier item)
  where
    renderTags :: [String] -> String
    renderTags = renderHtml . mconcat . map (H.li . toHtml)

main :: IO ()
main = hakyllWith config $ do
    match "images/*" $ do
        route   idRoute
        compile copyFileCompiler

    match "keybase.txt" $ do
        route   idRoute
        compile copyFileCompiler

    match "favicon.ico" $ do
        route   idRoute
        compile copyFileCompiler

    match "fonts/*" $ do
        route   idRoute
        compile copyFileCompiler

    match "css/*" $ do
        route   idRoute
        compile compressCssCompiler

    match (fromList ["about.md", "contact.md", "projects.md"]) $ do
        route   $ setExtension "html"
        compile $ pandocCompiler
            >>= loadAndApplyTemplate "templates/default.html" defaultContext
            >>= relativizeUrls

    tags <- buildTags "posts/*" (fromCapture "tags/*.html")

    tagsRules tags $ \tag pattern -> do
      let title = "Posts tagged \"" ++ tag ++ "\""
      route idRoute
      compile $ do
        posts <- recentFirst =<< loadAll pattern
        let ctx = constField "title" title
                  `mappend` listField "posts" postCtx (return posts)
                  `mappend` defaultContext
        makeItem "" >>= loadAndApplyTemplate "templates/tag.html" ctx >>= loadAndApplyTemplate "templates/default.html" ctx >>= relativizeUrls

    match "posts/*" $ do
        route $ setExtension "html"
        compile $ pandocCompiler
            >>= loadAndApplyTemplate "templates/post.html"    (postCtxWithTags tags)
            >>= saveSnapshot "content"
            >>= loadAndApplyTemplate "templates/default.html" (postCtxWithTags tags)
            >>= relativizeUrls

    create ["rss.xml"] $ do
        route idRoute
        compile $ do
          let feedCtx = postCtx `mappend` bodyField "description"
          posts <- fmap (take 10) . recentFirst =<<
                   loadAllSnapshots "posts/*" "content"
          renderRss feedConfig feedCtx posts

    create ["atom.xml"] $ do
        route idRoute
        compile $ do
          let feedCtx = postCtx `mappend` bodyField "description"
          posts <- fmap (take 10) . recentFirst =<<
                   loadAllSnapshots "posts/*" "content"
          renderAtom feedConfig feedCtx posts

    create ["archive.html"] $ do
        route idRoute
        compile $ do
            posts <- recentFirst =<< loadAll "posts/*"
            let archiveCtx =
                    listField "posts" postCtx (return posts) `mappend`
                    constField "title" "Archives"            `mappend`
                    defaultContext

            makeItem ""
                >>= loadAndApplyTemplate "templates/archive.html" archiveCtx
                >>= loadAndApplyTemplate "templates/default.html" archiveCtx
                >>= relativizeUrls


    match "index.html" $ do
        route idRoute
        compile $ do
            posts <- recentFirst =<< loadAll "posts/*"
            let indexCtx =
                    listField "posts" teaserCtx (return posts) `mappend`
                    constField "title" "Главная страница"                  `mappend`
                    defaultContext

            getResourceBody
                >>= applyAsTemplate indexCtx
                >>= loadAndApplyTemplate "templates/default.html" indexCtx
                >>= relativizeUrls

    match "templates/*" $ compile templateCompiler


--------------------------------------------------------------------------------
postCtx :: Context String
postCtx =
    dateField "date" "%B %e, %Y" `mappend`
    defaultContext
