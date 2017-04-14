module Paths_korolr (
    version,
    getBinDir, getLibDir, getDataDir, getLibexecDir,
    getDataFileName, getSysconfDir
  ) where

import qualified Control.Exception as Exception
import Data.Version (Version(..))
import System.Environment (getEnv)
import Prelude

catchIO :: IO a -> (Exception.IOException -> IO a) -> IO a
catchIO = Exception.catch

version :: Version
version = Version [0,1,0,0] []
bindir, libdir, datadir, libexecdir, sysconfdir :: FilePath

bindir     = "/home/korolr/Desktop/korolr.github.io/hakyll/.stack-work/install/x86_64-linux-ncurses6/lts-6.10/7.10.3/bin"
libdir     = "/home/korolr/Desktop/korolr.github.io/hakyll/.stack-work/install/x86_64-linux-ncurses6/lts-6.10/7.10.3/lib/x86_64-linux-ghc-7.10.3/korolr-0.1.0.0-1OMsZBt42YoDgPx3UutatY"
datadir    = "/home/korolr/Desktop/korolr.github.io/hakyll/.stack-work/install/x86_64-linux-ncurses6/lts-6.10/7.10.3/share/x86_64-linux-ghc-7.10.3/korolr-0.1.0.0"
libexecdir = "/home/korolr/Desktop/korolr.github.io/hakyll/.stack-work/install/x86_64-linux-ncurses6/lts-6.10/7.10.3/libexec"
sysconfdir = "/home/korolr/Desktop/korolr.github.io/hakyll/.stack-work/install/x86_64-linux-ncurses6/lts-6.10/7.10.3/etc"

getBinDir, getLibDir, getDataDir, getLibexecDir, getSysconfDir :: IO FilePath
getBinDir = catchIO (getEnv "korolr_bindir") (\_ -> return bindir)
getLibDir = catchIO (getEnv "korolr_libdir") (\_ -> return libdir)
getDataDir = catchIO (getEnv "korolr_datadir") (\_ -> return datadir)
getLibexecDir = catchIO (getEnv "korolr_libexecdir") (\_ -> return libexecdir)
getSysconfDir = catchIO (getEnv "korolr_sysconfdir") (\_ -> return sysconfdir)

getDataFileName :: FilePath -> IO FilePath
getDataFileName name = do
  dir <- getDataDir
  return (dir ++ "/" ++ name)
